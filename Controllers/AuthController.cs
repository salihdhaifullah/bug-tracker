using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.DTO;
using Buegee.Services.EmailService;
using Buegee.Services.CryptoService;
using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils.Attributes;
using Buegee.Models;
using Buegee.Services.FirebaseService;
using Buegee.Utils.Enums;
using Buegee.Utils;

namespace Buegee.Controllers;

[ApiRoute("auth")]
[Consumes("application/json")]
public class AuthController : Controller
{
    private readonly DataContext _ctx;
    private readonly ICryptoService _crypto;
    private readonly IEmailService _email;
    private readonly IAuthService _auth;
    private readonly IFirebaseService _firebase;

    public AuthController(
     DataContext ctx,
     ICryptoService crypto,
     IEmailService email,
     IAuthService auth,
     IFirebaseService firebase)
    {
        _ctx = ctx;
        _crypto = crypto;
        _email = email;
        _auth = auth;
        _firebase = firebase;
    }


    public record SingUpSession(string Code, string FirstName, string LastName, string Email, string Password);
    public record ForgetPasswordSession(string Code, string Email);

    [HttpPost("login"), Validation]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var isFound = await _ctx.Users
            .Where(u => u.Email == dto.Email)
            .Select(u => new
            {
                PasswordHash = u.PasswordHash,
                PasswordSalt = u.PasswordSalt,
                Id = u.Id,
                ContentId = u.ContentId,
                ImageUrl = Helper.StorageUrl(u.ImageName),
                Email = u.Email,
                FullName = $"{u.FirstName} {u.LastName}",
            })
            .FirstOrDefaultAsync();

        if (isFound is null) return HttpResult.NotFound($"this {dto.Email} email dose not exist try sing-up", null, "/auth/sing-up");

        _crypto.Compar(dto.Password, isFound.PasswordHash, isFound.PasswordSalt, out bool isMatch);

        if (!isMatch) return HttpResult.BadRequest("wrong email or password");

        _auth.LogIn(isFound.Id, HttpContext);

        // // TODO || redirect to dashboard
        return HttpResult.Ok("logged in successfully", new
        {
            id = isFound.Id,
            imageUrl = isFound.ImageUrl,
            email = isFound.Email,
            fullName = isFound.FullName,
            contentId = isFound.ContentId
        });
    }

    [HttpPost("sing-up"), Validation]
    public async Task<IActionResult> SingUp([FromBody] SingUpDTO dto)
    {
        var isFound = await _ctx.Users.AnyAsync(u => u.Email == dto.Email);

        if (isFound) return HttpResult.NotFound($"this account {dto.Email} is already exist try login", null, "/auth/login");

        var sessionTimeSpan = new TimeSpan(0, 30, 0);

        string Code = Helper.RandomCode();

        var payload = new SingUpSession(Code, dto.FirstName, dto.LastName, dto.Email, dto.Password);

        await _auth.SetSessionAsync<SingUpSession>("sing-up-session", sessionTimeSpan, payload, HttpContext);

        await _email.sendVerificationEmail(dto.Email, $"{dto.FirstName} {dto.LastName}", Code);

        return HttpResult.Ok("we have send to a 6 digits verification code", null, "/auth/account-verification");
    }

    [HttpPost("account-verification"), Validation]
    public async Task<IActionResult> AccountVerification([FromBody] AccountVerificationDTO dto)
    {
        var session = await _auth.GetSessionAsync<SingUpSession>("sing-up-session", HttpContext);

        if (session is null) return HttpResult.NotFound("session expired please try sign-up again", null, "/auth/sing-up");

        if (session.Code != dto.Code) return HttpResult.BadRequest("incorrect verification code. please try again");

        await _auth.DeleteSessionAsync("sing-up-session", HttpContext);

        _crypto.Hash(session.Password, out byte[] hash, out byte[] salt);

        string imageName;

        var userId = Ulid.NewUlid().ToString();
        var contentId = Ulid.NewUlid().ToString();

        using (var client = new HttpClient())
        {
            var imageBytes = await client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={userId}");
            imageName = await _firebase.Upload(imageBytes, ContentTypes.svg);
        }

        var content = await _ctx.Contents.AddAsync(new Content() { Markdown = "", OwnerId = userId, Id = contentId });

        var user = await _ctx.Users.AddAsync(new User
        {
            Email = session.Email,
            FirstName = session.FirstName,
            LastName = session.LastName,
            PasswordHash = hash,
            PasswordSalt = salt,
            Id = userId,
            ImageName = imageName,
            ContentId = contentId
        });

        await _ctx.SaveChangesAsync();

        _auth.LogIn(userId, HttpContext);

        // TODO || redirect to dashboard
        return HttpResult.Created("successfully verified your account", null, "/auth/login");
    }

    [HttpPost("forget-password"), Validation]
    public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordDTO dto)
    {
        var isFound = await _ctx.Users
            .Where(u => u.Email == dto.Email)
            .Select(u => new
            {
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .FirstOrDefaultAsync();


        if (isFound is null) return HttpResult.NotFound($"this {dto.Email} email dose not exist try sing-up", null, "/auth/sing-up");

        string code = Helper.RandomCode();

        var payload = new ForgetPasswordSession(code, isFound.Email);

        await _auth.SetSessionAsync<ForgetPasswordSession>("reset-password-session", new TimeSpan(0, 30, 0), payload, HttpContext);

        await _email.resetPasswordEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", code);

        return HttpResult.Ok("we have send to a 6 digits verification code", null, "/auth/reset-password");
    }


    [HttpPost("reset-password"), Validation]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
        var session = await _auth.GetSessionAsync<ForgetPasswordSession>("reset-password-session", HttpContext);

        if (session is null) return HttpResult.NotFound("session expired please try again", null, "/auth/forget-password");

        if (session.Code != dto.Code) return HttpResult.BadRequest("incorrect verification code. please try again");

        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == session.Email);

        if (user is null) return HttpResult.NotFound("this account dose not exist please try sing-up", null, "/auth/sing-up");

        await _auth.DeleteSessionAsync("reset-password-session", HttpContext);

        _crypto.Hash(dto.NewPassword, out byte[] hash, out byte[] salt);

        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok("successfully changed your password", null, "/auth/login");
    }

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return HttpResult.Ok("logged out successfully", null, "/");
    }
}
