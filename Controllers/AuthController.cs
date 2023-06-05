using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.DTO;
using Buegee.Services.RedisCacheService;
using Buegee.Services.EmailService;
using Buegee.Services.CryptoService;
using Buegee.Services.JWTService;
using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils.Attributes;
using Buegee.Models;
using static Buegee.Utils.Utils;
using Buegee.Services.FirebaseService;
using Buegee.Utils.Enums;

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
    private readonly IFirebaseService _firebase;

    public AuthController(
     DataContext ctx,
     ICryptoService crypto,
     IJWTService jwt,
     IEmailService email,
     IRedisCacheService cache,
     IConfiguration configuration,
     IAuthService auth,
     IFirebaseService firebase)
    {
        _ctx = ctx;
        _crypto = crypto;
        _jwt = jwt;
        _email = email;
        _cache = cache;
        _auth = auth;
        _firebase = firebase;
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
                ImageUrl = u.ImageUrl,
                Email = u.Email,
                FullName = $"{u.FirstName} {u.LastName}",
            })
            .FirstOrDefaultAsync();

        if (isFound is null)
        {
            return NotFoundResult($"this {dto.Email} email dose not exist try sing-up", null, "/auth/sing-up");
        }

        _crypto.Compar(dto.Password, isFound.PasswordHash, isFound.PasswordSalt, out bool isMatch);

        if (!isMatch)
        {
            return BadRequestResult("wrong email or password");
        };

        _auth.LogIn(isFound.Id, HttpContext);

        // // TODO || redirect to dashboard
        return OkResult("logged in successfully", new
        {
            id = isFound.Id,
            imageUrl = isFound.ImageUrl,
            email = isFound.Email,
            fullName = isFound.FullName
        });
    }

    [HttpPost("sing-up")]
    public async Task<IActionResult> SingUp([FromBody] SingUpDTO dto)
    {
        // check modelState and send error message if there any errors
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        // if there a user with this email redirect to login page with error message

        var isFound = await _ctx.Users.AnyAsync(u => u.Email == dto.Email);

        if (isFound) return NotFoundResult($"this account {dto.Email} is already exist try login", null, "/auth/login");

        // half an hour
        var sessionTimeSpan = new TimeSpan(0, 30, 0);

        // generate random 6 digits code
        string Code = RandomCode();

        var payload = new SingUpSession(Code, dto.FirstName, dto.LastName, dto.Email, dto.Password);

        await _auth.SetSessionAsync<SingUpSession>("sing-up-session", sessionTimeSpan, payload, HttpContext);

        // send the email
        await _email.sendVerificationEmail(dto.Email, $"{dto.FirstName} {dto.LastName}", Code);

        return OkResult("we have send to a 6 digits verification code", null, "/auth/account-verification");
    }



    [HttpPost("account-verification")]
    public async Task<IActionResult> AccountVerification([FromBody] AccountVerificationDTO dto)
    {
        // check modelState and send error message if there any errors
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        var session = await _auth.GetSessionAsync<SingUpSession>("sing-up-session", HttpContext);

        if (session is null) return NotFoundResult("session expired please try sign-up again", null, "/auth/sing-up");

        if (session.Code != dto.Code) return BadRequestResult("incorrect verification code. please try again");

        await _auth.DeleteSessionAsync("sing-up-session", HttpContext);

        _crypto.Hash(session.Password, out byte[] hash, out byte[] salt);


        (string url, string name) image;

        using (var client = new HttpClient())
        {
            var imageBytes = await client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={session.FirstName}-{session.LastName}-{session.Email}");
            image = await _firebase.Upload(imageBytes, ContentTypes.svg);
        }

        var content = await _ctx.Contents.AddAsync(new Content() { Markdown = "" });

        await _ctx.SaveChangesAsync();

        var userData = await _ctx.Users.AddAsync(new User
        {
            Email = session.Email,
            FirstName = session.FirstName,
            LastName = session.LastName,
            PasswordHash = hash,
            PasswordSalt = salt,
            ImageUrl = image.url,
            ImageName = image.name,
            ContentId = content.Entity.Id
        });

        await _ctx.SaveChangesAsync();

        _auth.LogIn(userData.Entity.Id, HttpContext);

        // TODO || redirect to dashboard
        return CreatedResult("successfully verified your account", null, "/auth/login");
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


        if (isFound is null) return NotFoundResult($"this {dto.Email} email dose not exist try sing-up", null, "/auth/sing-up");

        string code = RandomCode();

        var payload = new ForgetPasswordSession(code, isFound.Email);

        await _auth.SetSessionAsync<ForgetPasswordSession>("reset-password-session", new TimeSpan(0, 30, 0), payload, HttpContext);

        await _email.resetPasswordEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", code);

        return OkResult("we have send to a 6 digits verification code", null, "/auth/reset-password");
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
        if (TryGetModelErrorResult(ModelState, out var result)) return result!;

        var session = await _auth.GetSessionAsync<ForgetPasswordSession>("reset-password-session", HttpContext);


        if (session is null) return NotFoundResult("session expired please try again", null, "/auth/forget-password");

        if (session.Code != dto.Code) return BadRequestResult("incorrect verification code. please try again");

        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == session.Email);

        if (user is null) return NotFoundResult("this account dose not exist please try sing-up", null, "/auth/sing-up");

        await _auth.DeleteSessionAsync("reset-password-session", HttpContext);

        _crypto.Hash(dto.NewPassword, out byte[] hash, out byte[] salt);

        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        await _ctx.SaveChangesAsync();

        return OkResult("successfully changed your password", null, "/auth/login");
    }

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return OkResult("logged out successfully", null, "/");
    }
}
