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
using Buegee.Services;
using Buegee.Extensions.Classes;
using Buegee.Extensions.Enums;
using Buegee.Services.AuthService;
using Buegee.Extensions.Attributes;

namespace Buegee.Controllers;

[ApiRoute("auth")]
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

    [HttpPost("sing-up")]
    public async Task<IActionResult> SingUp([FromForm] SingUpVM Data)
    {
        if (!ModelState.IsValid) return View(Data);

        var IsFound = await _ctx.Users
            .Where(u => u.Email == Data.Email)
            .Select(u => new { Id = u.Id })
            .FirstOrDefaultAsync();

        if (IsFound is not null)
        {
            ViewData["Error"] = $"this account {Data.Email} is already exist try login";
            return View(Data);
        }

        var SessionTimeSpan = new TimeSpan(0, 30, 0);

        var cookieOptions = new CookieOptions()
        {
            IsEssential = true,
            Secure = true,
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            MaxAge = SessionTimeSpan
        };

        var SessionId = Guid.NewGuid().ToString();

        var SessionIdToken = _jwt.GenerateJwt(SessionTimeSpan, new List<Claim> { new Claim { Name = "sing-up-session", Value = SessionId } });

        Response.Cookies.Append("sing-up-session", SessionIdToken, cookieOptions);

        Random random = new Random();
        var CodeBS = new StringBuilder();

        for (int i = 0; i < 6; i++) CodeBS.Append(random.Next(10));

        string Code = CodeBS.ToString();

        string sessionData = JsonSerializer.Serialize(new SingUpSession(Code, Data.FirstName, Data.LastName, Data.Email, Data.Password));

        await _cache.Redis.StringSetAsync(SessionId, sessionData, SessionTimeSpan);

        await _email.sendVerificationEmail(Data.Email, $"{Data.FirstName} {Data.LastName}", Code);

        return Redirect("/auth/account-verification");
    }



    [HttpPost("account-verification")]
    public async Task<IActionResult> AccountVerification([FromForm] AccountVerificationVM data)
    {

        if (!ModelState.IsValid) return View(data);

        Request.Cookies.TryGetValue("sing-up-session", out var SessionIdToken);

        Dictionary<string, string> payload;

        try
        {
            payload = _jwt.VerifyJwt(SessionIdToken ?? "");
        }
        catch (Exception)
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        var SessionId = payload["sing-up-session"]?.ToString();



        if (String.IsNullOrEmpty(SessionId))
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        string? JsonSession = await _cache.Redis.StringGetAsync(SessionId);

        if (JsonSession is null)
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        var SessionData = JsonSerializer.Deserialize<SingUpSession>(JsonSession);

        if (SessionData is null)
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        if (SessionData.Code != data.Code)
        {
            ViewData["Error"] = "incorrect verification code. please try again";
            return View(data);
        }

        await _cache.Redis.KeyDeleteAsync(SessionId);

        _crypto.Hash(SessionData.Password, out byte[] hash, out byte[] salt);

        var imageBytes = await _client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={SessionData.FirstName}-{SessionData.LastName}-{SessionData.Email}");

        var image = new FileDB()
        {
            ContentType = ContentTypes.SVG,
            Data = imageBytes
        };

        var UserData = await _ctx.Users.AddAsync(new UserDB
        {
            Email = SessionData.Email,
            FirstName = SessionData.FirstName,
            LastName = SessionData.LastName,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = SessionData.Email == _adminEmail
                    ? Roles.ADMIN
                    : Roles.REPORTER,
            ImageId = image.Id,
            Image = image,
        });

        await _ctx.SaveChangesAsync();

        _auth.LogIn(UserData.Entity.Id, HttpContext, UserData.Entity.Role);
        // TODO || redirect to dashboard
        return Redirect("/");
    }


    [HttpPost("login")]
    [Consumes("application/json")]
    public async Task<IActionResult> Login([FromBody] LoginVM data)
    {

        if (!ModelState.IsValid)
        {
            var ErrorMessage = ModelState.Values.SelectMany(v => v.Errors).FirstOrDefault()?.ErrorMessage;
            if (!String.IsNullOrEmpty(ErrorMessage))
            {
                return StatusCode(StatusCodes.Status400BadRequest, new HTTPCustomResult(ResponseTypes.error, ErrorMessage).ToJson());
            }
        }

        var IsFound = await _ctx.Users
            .Where(u => u.Email == data.Email)
            .Select(u => new {
                Id = u.Id,
                PasswordHash = u.PasswordHash,
                PasswordSalt = u.PasswordSalt,
                Role = u.Role
            })
            .FirstOrDefaultAsync();

        if (IsFound is null)
        {
            return StatusCode(StatusCodes.Status404NotFound, new HTTPCustomResult(ResponseTypes.error, $"this {data.Email} email dose not exist try sing-up", "auth/sing-up").ToJson());
        }

        _crypto.Compar(data.Password, IsFound.PasswordHash, IsFound.PasswordSalt, out bool IsMatch);

        if (!IsMatch)
        {
            return StatusCode(StatusCodes.Status400BadRequest, new HTTPCustomResult(ResponseTypes.error, $"wrong email or password").ToJson());
        };

        _auth.LogIn(IsFound.Id, HttpContext, IsFound.Role);

        // // TODO || redirect to dashboard
        return StatusCode(StatusCodes.Status200OK, new HTTPCustomResult(ResponseTypes.ok, "logged in successfully").ToJson());
    }

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

        var SessionTimeSpan = new TimeSpan(0, 30, 0);

        var cookieOptions = new CookieOptions()
        {
            IsEssential = true,
            Secure = true,
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            MaxAge = SessionTimeSpan
        };

        var SessionId = Guid.NewGuid().ToString();

        var claims = new List<Claim> {
         new Claim {Name = "reset-password-session", Value = SessionId}
        };

        var SessionIdToken = _jwt.GenerateJwt(SessionTimeSpan, claims);

        Response.Cookies.Append("reset-password-session", SessionIdToken, cookieOptions);

        Random random = new Random();
        var CodeSB = new StringBuilder();

        for (int i = 0; i < 6; i++) CodeSB.Append(random.Next(10));

        string Code = CodeSB.ToString();

        string sessionData = JsonSerializer.Serialize(new ForgetPasswordSession(Code, isFound.Email));

        // third create session and store the code in redis

        await _cache.Redis.StringSetAsync(SessionId, sessionData, SessionTimeSpan);

        await _email.resetPasswordEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", Code);

        return Redirect("/auth/reset-password");
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromForm] ResetPasswordVM data)
    {
        if (!ModelState.IsValid) return View(data);

        Request.Cookies.TryGetValue("reset-password-session", out var SessionIdToken);

        Dictionary<string, string> payload;

        try
        {
            payload = _jwt.VerifyJwt(SessionIdToken ?? "");
        }
        catch (Exception)
        {
            return SessionExpiredResetPassword();
        }


        var SessionId = payload["reset-password-session"]?.ToString();

        if (String.IsNullOrEmpty(SessionId)) return SessionExpiredResetPassword();

        string? JsonSession = await _cache.Redis.StringGetAsync(SessionId);

        if (JsonSession is null) return SessionExpiredResetPassword();

        var SessionData = JsonSerializer.Deserialize<ForgetPasswordSession>(JsonSession);

        if (SessionData is null) return SessionExpiredResetPassword();

        if (SessionData.Code != data.Code)
        {
            ViewData["Error"] = "incorrect code. please try again";
            return View(data);
        }

        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == SessionData.Email);

        if (user is null)
        {
            ViewData["Error"] = "Something Went wrong please try again";
            return View(data);
        }

        await _cache.Redis.KeyDeleteAsync(SessionId);

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
