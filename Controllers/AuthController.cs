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
    private readonly ILogger<AuthController> _logger;

    public AuthController(
     DataContext ctx,
     ICryptoService crypto,
     IEmailService email,
     IAuthService auth,
     IFirebaseService firebase,
     ILogger<AuthController> logger)
    {
        _ctx = ctx;
        _crypto = crypto;
        _email = email;
        _auth = auth;
        _firebase = firebase;
        _logger = logger;
    }


    public record SingUpSession(string Code, string FirstName, string LastName, string Email, string Password);
    public record ForgetPasswordSession(string Code, string Email);

    [HttpPost("login"), BodyValidation]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        try
        {
            var isFound = await _ctx.Users
                .Where(u => u.Email == dto.Email)
                .Select(u => new
                {
                    passwordHash = u.PasswordHash,
                    passwordSalt = u.PasswordSalt,
                    id = u.Id,
                    imageUrl = Helper.StorageUrl(u.ImageName),
                    email = u.Email,
                    name = $"{u.FirstName} {u.LastName}",
                })
                .FirstOrDefaultAsync();

            if (isFound is null) return HttpResult.NotFound($"this {dto.Email} email dose not exist try sing-up", null, "/auth/sing-up");

            _crypto.Compar(dto.Password, isFound.passwordHash, isFound.passwordSalt, out bool isMatch);

            if (!isMatch) return HttpResult.BadRequest("wrong email or password");

            _auth.LogIn(isFound.id, HttpContext);

            // TODO || redirect to dashboard
            return HttpResult.Ok("logged in successfully", new
            {
                id = isFound.id,
                imageUrl = isFound.imageUrl,
                email = isFound.email,
                name = isFound.name,
            });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("sing-up"), BodyValidation]
    public async Task<IActionResult> SingUp([FromBody] SingUpDTO dto)
    {
        try
        {
            var isFound = await _ctx.Users.AnyAsync(u => u.Email == dto.Email);

            if (isFound) return HttpResult.NotFound($"this account {dto.Email} is already exist try login", null, "/auth/login");

            var sessionTimeSpan = new TimeSpan(0, 30, 0);

            string Code = Helper.RandomCode();

            var payload = new SingUpSession(Code, dto.FirstName, dto.LastName, dto.Email, dto.Password);

            await _auth.SetSessionAsync<SingUpSession>("sing-up-session", sessionTimeSpan, payload, HttpContext);

            _email.Verification(dto.Email, $"{dto.FirstName} {dto.LastName}", Code);

            return HttpResult.Ok("we have send to a 6 digits verification code", null, "/auth/account-verification");
        }
         catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("account-verification"), BodyValidation]
    public async Task<IActionResult> AccountVerification([FromBody] AccountVerificationDTO dto)
    {
        try
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
                imageName = await _firebase.Upload(imageBytes, ContentType.svg);
            }

            var content = await _ctx.Contents.AddAsync(new Content() { Id = contentId });

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
         catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("forget-password"), BodyValidation]
    public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordDTO dto)
    {
        try
        {
            var user = await _ctx.Users
                .Where(u => u.Email == dto.Email)
                .Select(u => new
                {
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                })
                .FirstOrDefaultAsync();


            if (user is null) return HttpResult.NotFound($"this {dto.Email} email dose not exist try sing-up", null, "/auth/sing-up");

            string code = Helper.RandomCode();

            var payload = new ForgetPasswordSession(code, user.Email);

            await _auth.SetSessionAsync<ForgetPasswordSession>("reset-password-session", new TimeSpan(0, 30, 0), payload, HttpContext);

            _email.ResetPassword(user.Email, $"{user.FirstName} {user.LastName}", code);

            return HttpResult.Ok("we have send to you a 6 digits verification code", null, "/auth/reset-password");
        }
         catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpPost("reset-password"), BodyValidation]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
        try
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
         catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        try
        {
            Response.Cookies.Delete("token");
            return HttpResult.Ok("logged out successfully", null, "/");
        }
         catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
