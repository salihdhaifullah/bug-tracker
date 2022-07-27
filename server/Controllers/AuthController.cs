using Microsoft.AspNetCore.Mvc;
using server.Data;
using Microsoft.EntityFrameworkCore;
using server.Services.PasswordServices;
using server.Services.EmailServices;
using server.Services.JsonWebToken;
using server.Models.api;
using server.Models.db;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Context _context;
        private readonly IEmailServices _email;
        private readonly IJsonWebToken _token;
        private readonly IPasswordServices _password;

        public AuthController(Context context, IEmailServices email, IJsonWebToken token, IPasswordServices password)
        {
            _context = context;
            _email = email;
            _token = token;
            _password = password;
        }


        [HttpPost("Singin")]
        public async Task<IActionResult> SingIn(UserSinginReq req)
        {
            bool IsFound = _context.Users.Any(user => user.Email == req.Email);
            if (IsFound) return BadRequest("User Already Exist");

            _password.CreatePasswordHash(req.Password, out string passwordHash, out string passwordSalt);

            User user = new()
            {
                Email = req.Email,
                PasswordSalt = passwordSalt,
                HashPassword = passwordHash,
                FirstName = req.FirstName,
                LastName = req.LastName,
                CreateAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginReq req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(user => user.Email == req.Email);
            if (user == null) return BadRequest("User Not Found");
            bool isMatch = _password.VerifyPasswordHash(req.Password, user.HashPassword, user.PasswordSalt);
            if (!isMatch) return BadRequest("Password is Wrong");

            return Ok("Login Success");
        }

        [HttpPost("hello")]
        public async Task<IActionResult> SendEmail(EmailDto req)
        {
            try
            {
                await _email.SendEmail(req);

                return Ok("Email Send");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("token")]
        public IActionResult SendToken([FromQuery] string id)
        {
            string token = _token.GenerateToken(Convert.ToInt32(id));
            CookieOptions cookieOptions = new CookieOptions { Secure = true, HttpOnly = true, SameSite = SameSiteMode.Lax, Expires = DateTimeOffset.UtcNow.AddHours(10) };
            Response.Cookies.Append("token", token, cookieOptions);
            return Ok(token);
        }

        [HttpGet("verify")]
        public IActionResult Verify([FromQuery] string token)
        {
            int? isValid = _token.VerifyToken(token);
            if (!Convert.ToBoolean(isValid)) return BadRequest("Token is not Valid");
            return Ok("Token is Valid");
        }
    }
}
