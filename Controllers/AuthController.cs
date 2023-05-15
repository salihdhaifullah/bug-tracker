using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Models.VM;
using Buegee.Services.RedisCacheService;
using System.Text.Json;
using System.Text;
using Buegee.Services.EmailService;
using Buegee.Services.CryptoService;
using Buegee.Services.JWTService;
using Buegee.Models.DB;
using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Buegee.Utils.Attributes;

namespace Buegee.Controllers;

[ApiRoute("auth")]
[Consumes("application/json")]
public class AuthController : Controller
{
    private readonly DataContext _ctx;
    private readonly HttpClient _client;
    private readonly ICryptoService _crypto;
    private readonly IJWTService _jwt;
    private readonly IEmailService _email;
    private readonly IRedisCacheService _cache;
    private readonly IAuthService _auth;
    private readonly string _adminEmail;

    public AuthController(
     DataContext ctx,
     ICryptoService crypto,
     IJWTService jwt,
     IEmailService email,
     IRedisCacheService cache,
     IConfiguration configuration,
     IAuthService auth)
    {
        _ctx = ctx;
        _client = new HttpClient();
        _crypto = crypto;
        _jwt = jwt;
        _email = email;
        _cache = cache;
        _auth = auth;

        string? adminEmail = configuration.GetSection("Admin").GetValue<string>("Email");
        if (String.IsNullOrEmpty(adminEmail)) throw new Exception("Admin Email Are Not Configured");

        _adminEmail = adminEmail;
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginVM data)
    {
        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;

        var isFound = await _ctx.Users
            .Where(u => u.Email == data.Email)
            .Select(u => new
            {
                PasswordHash = u.PasswordHash,
                PasswordSalt = u.PasswordSalt,
                Id = u.Id,
                Role = u.Role,
                ImageId = u.ImageId,
                Email = u.Email,
                FullName = $"{u.FirstName}  {u.LastName}",
            })
            .FirstOrDefaultAsync();

        if (isFound is null)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Massage($"this {data.Email} email dose not exist try sing-up")
                    .StatusCode(404)
                    .RedirectTo("/auth/sing-up")
                    .Get();
        }

        _crypto.Compar(data.Password, isFound.PasswordHash, isFound.PasswordSalt, out bool isMatch);

        if (!isMatch)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Massage("wrong email or password")
                    .StatusCode(400)
                    .Get();
        };

        _auth.LogIn(isFound.Id, HttpContext, isFound.Role);

        // // TODO || redirect to dashboard
        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Massage("logged in successfully")
                .Body(new UserResult(isFound.Id, isFound.Role.ToString(), isFound.ImageId, isFound.Email, isFound.FullName))
                .Get();
    }

    [HttpPost("sing-up")]
    public async Task<IActionResult> SingUp([FromBody] SingUpVM data)
    {
        // check modelState and send error massage if there any errors
        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;

        // if there a user with this email redirect to login page with error massage

        var isFound = await _ctx.Users
            .Where(u => u.Email == data.Email)
            .Select(u => new { Id = u.Id })
            .FirstOrDefaultAsync();

        if (isFound is not null)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Massage($"this account {data.Email} is already exist try login")
                    .StatusCode(404)
                    .RedirectTo("/auth/login")
                    .Get();
        }

        // half an hour
        var sessionTimeSpan = new TimeSpan(0, 30, 0);

        // generate new guid
        var sessionId = Guid.NewGuid().ToString();

        var claims = new Dictionary<string, string>();
        claims["sing-up-session"] = sessionId;

        // generate jwt with the guid as value
        var sessionIdToken = _jwt.GenerateJwt(sessionTimeSpan, claims);

        //  append the jwt in user cookies
        Response.Cookies.Append("sing-up-session", sessionIdToken, Main.CookieConfig(sessionTimeSpan));

        // generate random 6 digits code
        string Code = Main.RandomCode();

        //  Serialize the user sended data to sing-up with the random code, it will be stored for half an hour in redis cache
        await _cache.Redis.StringSetAsync(sessionId, JsonSerializer.Serialize(new SingUpSession(Code, data.FirstName, data.LastName, data.Email, data.Password)), sessionTimeSpan);

        // send the email
        await _email.sendVerificationEmail(data.Email, $"{data.FirstName} {data.LastName}", Code);

        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Massage("we have send to a 6 digits verification code")
                .RedirectTo("/auth/account-verification")
                .Get();
    }

    [HttpPost("account-verification")]
    public async Task<IActionResult> AccountVerification([FromForm] AccountVerificationVM data)
    {
        // check modelState and send error massage if there any errors
        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;


        Request.Cookies.TryGetValue("sing-up-session", out var sessionIdToken);

        Dictionary<string, string> payload;

        try
        {
            payload = _jwt.VerifyJwt(sessionIdToken ?? "");
        }
        catch (Exception)
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        var sessionId = payload["sing-up-session"]?.ToString();

        if (String.IsNullOrEmpty(sessionId))
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        string? jsonSession = await _cache.Redis.StringGetAsync(sessionId);

        if (jsonSession is null)
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        var sessionData = JsonSerializer.Deserialize<SingUpSession>(jsonSession);

        if (sessionData is null)
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        if (sessionData.Code != data.Code)
        {
            ViewData["Error"] = "incorrect verification code. please try again";
            return View(data);
        }

        await _cache.Redis.KeyDeleteAsync(sessionId);

        _crypto.Hash(sessionData.Password, out byte[] hash, out byte[] salt);

        var imageBytes = await _client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={sessionData.FirstName}-{sessionData.LastName}-{sessionData.Email}");

        var image = new FileDB()
        {
            ContentType = ContentTypes.SVG,
            Data = imageBytes
        };

        var userData = await _ctx.Users.AddAsync(new UserDB
        {
            Email = sessionData.Email,
            FirstName = sessionData.FirstName,
            LastName = sessionData.LastName,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = sessionData.Email == _adminEmail
                    ? Roles.ADMIN
                    : Roles.REPORTER,
            ImageId = image.Id,
            Image = image,
        });

        await _ctx.SaveChangesAsync();

        _auth.LogIn(userData.Entity.Id, HttpContext, userData.Entity.Role);
        // TODO || redirect to dashboard
        return Redirect("/");
    }



    public record UserResult(int id, string role, int imageId, string email, string fullName);

    [HttpPost("forget-password")]
    public async Task<IActionResult> ForgetPassword([FromForm] ForgetPasswordVM data)
    {
        if (!ModelState.IsValid) return View(data);
        // first check if user email exist
        var isFound = await _ctx.Users
            .Where(u => u.Email == data.Email)
            .Select(u => new
            {
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .FirstOrDefaultAsync();

        if (isFound is null)
        {
            ViewData["Error"] = $"this {data.Email} email dose not exist try sing-up";
            return View(data);
        }

        // second send user one time password in email

        var sessionTimeSpan = new TimeSpan(0, 30, 0);

        var sessionId = Guid.NewGuid().ToString();

        var claims = new Dictionary<string, string>();
        claims["reset-password-session"] = sessionId;

        var sessionIdToken = _jwt.GenerateJwt(sessionTimeSpan, claims);

        Response.Cookies.Append("reset-password-session", sessionIdToken, Main.CookieConfig(sessionTimeSpan));


        string code = Main.RandomCode();

        string sessionData = JsonSerializer.Serialize(new ForgetPasswordSession(code, isFound.Email));

        // third create session and store the code in redis

        await _cache.Redis.StringSetAsync(sessionId, sessionData, sessionTimeSpan);

        await _email.resetPasswordEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", code);

        return Redirect("/auth/reset-password");
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromForm] ResetPasswordVM data)
    {
        if (!ModelState.IsValid) return View(data);

        Request.Cookies.TryGetValue("reset-password-session", out var sessionIdToken);

        Dictionary<string, string> payload;

        try
        {
            payload = _jwt.VerifyJwt(sessionIdToken ?? "");
        }
        catch (Exception)
        {
            return SessionExpiredResetPassword();
        }


        var sessionId = payload["reset-password-session"]?.ToString();

        if (String.IsNullOrEmpty(sessionId)) return SessionExpiredResetPassword();

        string? jsonSession = await _cache.Redis.StringGetAsync(sessionId);

        if (jsonSession is null) return SessionExpiredResetPassword();

        var sessionData = JsonSerializer.Deserialize<ForgetPasswordSession>(jsonSession);

        if (sessionData is null) return SessionExpiredResetPassword();

        if (sessionData.Code != data.Code)
        {
            ViewData["Error"] = "incorrect code. please try again";
            return View(data);
        }

        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == sessionData.Email);

        if (user is null)
        {
            ViewData["Error"] = "Something Went wrong please try again";
            return View(data);
        }

        await _cache.Redis.KeyDeleteAsync(sessionId);

        _crypto.Hash(data.NewPassword, out byte[] hash, out byte[] salt);

        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        await _ctx.SaveChangesAsync();

        return Redirect("/auth/login");
    }

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return Redirect("/");
    }

    public record SingUpSession(string Code, string FirstName, string LastName, string Email, string Password);
    public record ForgetPasswordSession(string Code, string Email);

    public IActionResult SessionExpired()
    {
        ViewData["Error"] = "session expired please try sign-up again";
        return Redirect("/auth/sing-up");
    }

    public IActionResult SessionExpiredResetPassword()
    {
        ViewData["Error"] = "session expired please try again";
        return View("Auth/ForgetPassword", new ForgetPasswordVM());
    }
}
