using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Models.VM;
using Buegee.Services.RedisCacheService;
using System.Text.Json;
using System.Text;
using StackExchange.Redis;
using Buegee.Services.EmailService;
using Buegee.Services.CryptoService;
using Buegee.Services.JWTService;
using Buegee.Models.DB;

namespace Buegee.Controllers;

[Controller]
[Route("auth")]
public class AuthController : Controller
{
    private readonly DataContext _ctx;
    private readonly ICryptoService _hash;
    private readonly IJWTService _jwt;
    private readonly IEmailService _email;
    private readonly IDatabase _cache;

    public AuthController(DataContext ctx, ICryptoService hash, IJWTService jwt, IEmailService email, IRedisCacheService cache)
    {
        _ctx = ctx;
        _hash = hash;
        _jwt = jwt;
        _email = email;
        _cache = cache.Redis;
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

        var claims = new List<Claim> {
         new Claim {name = "sing-up-session", value = SessionId}
        };

        var SessionIdToken = _jwt.GenerateJwt((long)SessionTimeSpan.TotalMilliseconds, claims);

        Response.Cookies.Append("sing-up-session", SessionIdToken, cookieOptions);

        Random random = new Random();
        var CodeBS = new StringBuilder();

        for (int i = 0; i < 6; i++) CodeBS.Append(random.Next(10));

        string Code = CodeBS.ToString();

        string sessionData = JsonSerializer.Serialize(new SingUpSession(Code, Data.FirstName, Data.LastName, Data.Email, Data.Password));

        await _cache.StringSetAsync(SessionId, sessionData, SessionTimeSpan);

        await _email.sendVerificationEmail(Data.Email, $"{Data.FirstName} {Data.LastName}", Code);

        return Redirect("/auth/account-verification");
    }



    [HttpPost("account-verification")]
    public async Task<IActionResult> AccountVerification([FromForm] AccountVerificationVM data)
    {

        if (!ModelState.IsValid) return View(data);

        Request.Cookies.TryGetValue("sing-up-session", out var SessionIdToken);

        var (payload, error) = _jwt.VerifyJwt(SessionIdToken ?? "");

        var SessionId = payload?["sing-up-session"]?.ToString();

        if (error is not null || String.IsNullOrEmpty(SessionId))
        {
            ViewData["Error"] = "session expired please try sign-up again";
            return View(data);
        }

        string? JsonSession = await _cache.StringGetAsync(SessionId);

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

        await _cache.KeyDeleteAsync(SessionId);

        var (hash, salt) = _hash.Hash(SessionData.Password);

        var UserData = await _ctx.Users.AddAsync(new UserDB
        {
            Email = SessionData.Email,
            FirstName = SessionData.FirstName,
            LastName = SessionData.LastName,
            PasswordHash = hash,
            PasswordSalt = salt
        });

        await _ctx.SaveChangesAsync();

        SetAuthCookies(UserData.Entity.Id.ToString(), UserData.Entity.Role.ToString());
        // TODO || redirect to dashboard
        return Redirect("/");
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromForm] LoginVM data)
    {
        if (!ModelState.IsValid) return View(data);

        var isFound = await _ctx.Users
            .Where(u => u.Email == data.Email)
            .Select(u => new
            {
                Id = u.Id,
                PasswordHash = u.PasswordHash,
                PasswordSalt = u.PasswordSalt,
                Role = u.Role
            }).FirstOrDefaultAsync();

        if (isFound is null)
        {
            ViewData["Error"] = $"this {data.Email} email dose not exist try sing-up";
            return View(data);
        }

        if (!_hash.Compar(data.Password, isFound.PasswordHash, isFound.PasswordSalt))
        {
            ViewData["Error"] = "password is incorrect";
            return View(data);
        };

        SetAuthCookies(isFound.Id.ToString(), isFound.Role.ToString());
        // TODO || redirect to dashboard
        return Redirect("/");
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
         new Claim {name = "reset-password-session", value = SessionId}
        };

        var SessionIdToken = _jwt.GenerateJwt((long)SessionTimeSpan.TotalMilliseconds, claims);

        Response.Cookies.Append("reset-password-session", SessionIdToken, cookieOptions);

        Random random = new Random();
        var CodeBS = new StringBuilder();

        for (int i = 0; i < 6; i++) CodeBS.Append(random.Next(10));

        string Code = CodeBS.ToString();

        string sessionData = JsonSerializer.Serialize(new ForgetPasswordSession(Code, isFound.Email));

        // third create session and store the code in redis

        await _cache.StringSetAsync(SessionId, sessionData, SessionTimeSpan);

        await _email.resetPasswordEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", Code);

        return Redirect("/auth/reset-password");
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromForm] ResetPasswordVM data)
    {
        if (!ModelState.IsValid) return View(data);

        Request.Cookies.TryGetValue("reset-password-session", out var SessionIdToken);

        var (payload, error) = _jwt.VerifyJwt(SessionIdToken ?? "");

        var SessionId = payload?["reset-password-session"]?.ToString();

        if (error is not null || String.IsNullOrEmpty(SessionId)) return SessionExpiredResetPassword();

        string? JsonSession = await _cache.StringGetAsync(SessionId);

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

        await _cache.KeyDeleteAsync(SessionId);
        var (hash, salt) = _hash.Hash(data.NewPassword);

        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        await _ctx.SaveChangesAsync();

        return Redirect("/auth/login");
    }

    [HttpGet("forget-password")]
    public IActionResult ForgetPassword()
    {
        return View(new ForgetPasswordVM());
    }

    [HttpGet("login")]
    public IActionResult Login()
    {
        return View(new LoginVM());
    }

    [HttpGet("sing-up")]
    public IActionResult SingUp()
    {
        return View(new SingUpVM());
    }

    [HttpGet("account-verification")]
    public IActionResult AccountVerification()
    {
        return View(new AccountVerificationVM());
    }

    [HttpGet("reset-password")]
    public IActionResult ResetPassword()
    {
        return View(new ResetPasswordVM());
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

    public void SetAuthCookies(string Id, string Role)
    {
        var cookieOptions = new CookieOptions()
        {
            IsEssential = true,
            Secure = true,
            HttpOnly = true,
            SameSite = SameSiteMode.Strict
        };

        var claims = new List<Claim> {
            new Claim {name = "id", value = Id},
            new Claim {name = "role", value = Role}
        };

        var Token = _jwt.GenerateJwt(31536000000, claims);

        cookieOptions.Expires = DateTime.Now.AddYears(1);

        Response.Cookies.Append("token", Token, cookieOptions);
    }
}
