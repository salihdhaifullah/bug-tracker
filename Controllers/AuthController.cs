using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Models.VM;
using Buegee.Services.RedisCacheService;
using System.Text.Json;
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


    public record SingUpSession(string Code, string FirstName, string LastName, string Email, string Password);
    public record ForgetPasswordSession(string Code, string Email);

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
                    .Message($"this {data.Email} email dose not exist try sing-up")
                    .StatusCode(404)
                    .RedirectTo("/auth/sing-up")
                    .Get();
        }

        _crypto.Compar(data.Password, isFound.PasswordHash, isFound.PasswordSalt, out bool isMatch);

        if (!isMatch)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Message("wrong email or password")
                    .StatusCode(400)
                    .Get();
        };

        _auth.LogIn(isFound.Id, HttpContext, isFound.Role);

        // // TODO || redirect to dashboard
        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Message("logged in successfully")
                .Body(new
                {
                    id = isFound.Id,
                    role = isFound.Role.ToString(),
                    imageId = isFound.ImageId,
                    email = isFound.Email,
                    fullName = isFound.FullName
                })
                .Get();
    }

    [HttpPost("sing-up")]
    public async Task<IActionResult> SingUp([FromBody] SingUpVM data)
    {
        // check modelState and send error message if there any errors
        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;

        // if there a user with this email redirect to login page with error message

        var isFound = await _ctx.Users
            .Where(u => u.Email == data.Email)
            .Select(u => new { Id = u.Id })
            .FirstOrDefaultAsync();

        if (isFound is not null)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Message($"this account {data.Email} is already exist try login")
                    .StatusCode(404)
                    .RedirectTo("/auth/login")
                    .Get();
        }

        // half an hour
        var sessionTimeSpan = new TimeSpan(0, 30, 0);

        // generate random 6 digits code
        string Code = Main.RandomCode();

        var payload = new SingUpSession(Code, data.FirstName, data.LastName, data.Email, data.Password);

        await _auth.SetSessionAsync<SingUpSession>("sing-up-session", sessionTimeSpan, payload, HttpContext);

        // send the email
        await _email.sendVerificationEmail(data.Email, $"{data.FirstName} {data.LastName}", Code);

        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Message("we have send to a 6 digits verification code")
                .RedirectTo("/auth/account-verification")
                .Get();
    }



    [HttpPost("account-verification")]
    public async Task<IActionResult> AccountVerification([FromBody] AccountVerificationVM data)
    {
        // check modelState and send error message if there any errors
        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;

        var session = await _auth.GetSessionAsync<SingUpSession>("sing-up-session", HttpContext);

        if (session is null) return new HttpResult()
                                .IsOk(false)
                                .Message("session expired please try sign-up again")
                                .StatusCode(404)
                                .RedirectTo("/auth/sing-up")
                                .Get();


        if (session.Code != data.Code) return new HttpResult()
                                .IsOk(false)
                                .Message("incorrect verification code. please try again")
                                .StatusCode(400)
                                .Get();

        await _auth.DeleteSessionAsync("sing-up-session", HttpContext);

        _crypto.Hash(session.Password, out byte[] hash, out byte[] salt);

        var imageBytes = await _client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={session.FirstName}-{session.LastName}-{session.Email}");

        var image = new FileDB()
        {
            ContentType = ContentTypes.SVG,
            Data = imageBytes,
            IsPrivate = false,
        };

        var userData = await _ctx.Users.AddAsync(new UserDB
        {
            Email = session.Email,
            FirstName = session.FirstName,
            LastName = session.LastName,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = session.Email == _adminEmail
                    ? Roles.ADMIN
                    : Roles.REPORTER,
            ImageId = image.Id,
            Image = image,
        });

        await _ctx.SaveChangesAsync();

        _auth.LogIn(userData.Entity.Id, HttpContext, userData.Entity.Role);

        // TODO || redirect to dashboard
        return new HttpResult().IsOk(true)
                                .Message("successfully verified your account")
                                .StatusCode(201)
                                .RedirectTo("/auth/login")
                                .Get();
    }




    [HttpPost("forget-password")]
    public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordVM data)
    {

        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;

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


        if (isFound is null) return new HttpResult()
                            .RedirectTo("/auth/sing-up")
                            .Message($"this {data.Email} email dose not exist try sing-up")
                            .IsOk(false)
                            .StatusCode(404)
                            .Get();

        string code = Main.RandomCode();

        var payload = new ForgetPasswordSession(code, isFound.Email);

        await _auth.SetSessionAsync<ForgetPasswordSession>("reset-password-session", new TimeSpan(0, 30, 0), payload, HttpContext);

        await _email.resetPasswordEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", code);

        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Message("we have send to a 6 digits verification code")
                .RedirectTo("/auth/reset-password")
                .Get();
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordVM data)
    {
        if (Main.TryGetModelErrorResult(ModelState, out var result)) return result!;

       var session = await  _auth.GetSessionAsync<ForgetPasswordSession>("reset-password-session", HttpContext);


        if (session is null) return new HttpResult()
                                .IsOk(false)
                                .Message("session expired please try again")
                                .StatusCode(404)
                                .RedirectTo("/auth/forget-password")
                                .Get();


        if (session.Code != data.Code) return new HttpResult()
                                .IsOk(false)
                                .Message("incorrect verification code. please try again")
                                .StatusCode(400)
                                .Get();

        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == session.Email);

        if (user is null) return new HttpResult()
                                .IsOk(false)
                                .Message("this account dose not exist please try sing-up")
                                .StatusCode(404)
                                .RedirectTo("/auth/sing-up")
                                .Get();


        await _auth.DeleteSessionAsync("reset-password-session", HttpContext);

        _crypto.Hash(data.NewPassword, out byte[] hash, out byte[] salt);

        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        await _ctx.SaveChangesAsync();

        return new HttpResult()
                    .IsOk(true)
                    .Message("successfully changed your password")
                    .StatusCode(200)
                    .RedirectTo("/auth/login")
                    .Get();
    }

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return new HttpResult().RedirectTo("/").Get();
    }
}
