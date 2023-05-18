using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.DTO;
using Buegee.Services.RedisCacheService;
using Buegee.Services.EmailService;
using Buegee.Services.CryptoService;
using Buegee.Services.JWTService;
using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Buegee.Utils.Attributes;
using Buegee.Models;
using static Buegee.Utils.Utils;

namespace Buegee.Controllers;

[ApiRoute("auth")]
[Consumes("application/json")]
public class AuthController : Controller
{
    private readonly DataContext _ctx;
    private readonly ICryptoService _crypto;
    private readonly IJWTService _jwt;
    private readonly IEmailService _email;
    private readonly IRedisCacheService _cache;
    private readonly IAuthService _auth;

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
        _crypto = crypto;
        _jwt = jwt;
        _email = email;
        _cache = cache;
        _auth = auth;
    }


    public record SingUpSession(string Code, string FirstName, string LastName, string Email, string Password);
    public record ForgetPasswordSession(string Code, string Email);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        var isFound = await _ctx.Users
            .Where(u => u.Email == dto.Email)
            .Select(u => new
            {
                PasswordHash = u.PasswordHash,
                PasswordSalt = u.PasswordSalt,
                Id = u.Id,
                ImageId = u.ImageId,
                Email = u.Email,
                FullName = $"{u.FirstName}  {u.LastName}",
            })
            .FirstOrDefaultAsync();

        if (isFound is null)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Message($"this {dto.Email} email dose not exist try sing-up")
                    .StatusCode(404)
                    .RedirectTo("/auth/sing-up")
                    .Get();
        }

        _crypto.Compar(dto.Password, isFound.PasswordHash, isFound.PasswordSalt, out bool isMatch);

        if (!isMatch)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Message("wrong email or password")
                    .StatusCode(400)
                    .Get();
        };

        _auth.LogIn(isFound.Id, HttpContext);

        // // TODO || redirect to dashboard
        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Message("logged in successfully")
                .Body(new
                {
                    id = isFound.Id,
                    imageId = isFound.ImageId,
                    email = isFound.Email,
                    fullName = isFound.FullName
                })
                .Get();
    }

    [HttpPost("sing-up")]
    public async Task<IActionResult> SingUp([FromBody] SingUpDTO dto)
    {
        // check modelState and send error message if there any errors
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        // if there a user with this email redirect to login page with error message

        var isFound = await _ctx.Users
            .Where(u => u.Email == dto.Email)
            .Select(u => new { Id = u.Id })
            .FirstOrDefaultAsync();

        if (isFound is not null)
        {
            return new HttpResult()
                    .IsOk(false)
                    .Message($"this account {dto.Email} is already exist try login")
                    .StatusCode(404)
                    .RedirectTo("/auth/login")
                    .Get();
        }

        // half an hour
        var sessionTimeSpan = new TimeSpan(0, 30, 0);

        // generate random 6 digits code
        string Code = RandomCode();

        var payload = new SingUpSession(Code, dto.FirstName, dto.LastName, dto.Email, dto.Password);

        await _auth.SetSessionAsync<SingUpSession>("sing-up-session", sessionTimeSpan, payload, HttpContext);

        // send the email
        await _email.sendVerificationEmail(dto.Email, $"{dto.FirstName} {dto.LastName}", Code);

        return new HttpResult()
                .StatusCode(200)
                .IsOk(true)
                .Message("we have send to a 6 digits verification code")
                .RedirectTo("/auth/account-verification")
                .Get();
    }



    [HttpPost("account-verification")]
    public async Task<IActionResult> AccountVerification([FromBody] AccountVerificationDTO dto)
    {
        // check modelState and send error message if there any errors
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        var session = await _auth.GetSessionAsync<SingUpSession>("sing-up-session", HttpContext);

        if (session is null) return new HttpResult()
                                .IsOk(false)
                                .Message("session expired please try sign-up again")
                                .StatusCode(404)
                                .RedirectTo("/auth/sing-up")
                                .Get();


        if (session.Code != dto.Code) return new HttpResult()
                                .IsOk(false)
                                .Message("incorrect verification code. please try again")
                                .StatusCode(400)
                                .Get();

        await _auth.DeleteSessionAsync("sing-up-session", HttpContext);

        _crypto.Hash(session.Password, out byte[] hash, out byte[] salt);


        byte[] imageBytes;

        using (var client = new HttpClient())
        {
            imageBytes = await client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={session.FirstName}-{session.LastName}-{session.Email}");
        }

        var image = new Document()
        {
            ContentType = ContentTypes.svg,
            Data = imageBytes,
            IsPrivate = false,
        };

        var userData = await _ctx.Users.AddAsync(new User
        {
            Email = session.Email,
            FirstName = session.FirstName,
            LastName = session.LastName,
            PasswordHash = hash,
            PasswordSalt = salt,
            ImageId = image.Id,
            Image = image,
        });

        await _ctx.SaveChangesAsync();

        _auth.LogIn(userData.Entity.Id, HttpContext);

        // TODO || redirect to dashboard
        return new HttpResult().IsOk(true)
                                .Message("successfully verified your account")
                                .StatusCode(201)
                                .RedirectTo("/auth/login")
                                .Get();
    }




    [HttpPost("forget-password")]
    public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordDTO dto)
    {

        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        // first check if user email exist
        var isFound = await _ctx.Users
            .Where(u => u.Email == dto.Email)
            .Select(u => new
            {
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .FirstOrDefaultAsync();


        if (isFound is null) return new HttpResult()
                            .RedirectTo("/auth/sing-up")
                            .Message($"this {dto.Email} email dose not exist try sing-up")
                            .IsOk(false)
                            .StatusCode(404)
                            .Get();

        string code = RandomCode();

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
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        var session = await _auth.GetSessionAsync<ForgetPasswordSession>("reset-password-session", HttpContext);


        if (session is null) return new HttpResult()
                                .IsOk(false)
                                .Message("session expired please try again")
                                .StatusCode(404)
                                .RedirectTo("/auth/forget-password")
                                .Get();


        if (session.Code != dto.Code) return new HttpResult()
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

        _crypto.Hash(dto.NewPassword, out byte[] hash, out byte[] salt);

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
        return new HttpResult().RedirectTo("/").IsOk(true).Message("logged out successfully").Get();
    }
}
