using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Services.PasswordServices;
using server.Services.JsonWebToken;
using server.Models.api;
using server.Models.db;
using Microsoft.AspNetCore.Authorization;


namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Context _context;
        private readonly IJsonWebToken _token;
        private readonly IPasswordServices _password;
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration, Context context, IJsonWebToken token, IPasswordServices password)
        {
            _context = context;
            _token = token;
            _password = password;
            _configuration = configuration;
        }



        [HttpPost("Singin"), AllowAnonymous]
        public async Task<IActionResult> SingIn(UserSinginDto req)
        {
            try
            {
                bool IsFound = _context.Users.Any(user => user.Email == req.Email);
                if (IsFound) return BadRequest("User Already Exist");

                _password.CreatePasswordHash(req.Password, out string passwordHash, out string passwordSalt);


                User user;


                if (req.Password == _configuration.GetSection("Admin:Password").Value && req.Email == _configuration.GetSection("Admin:Email").Value)
                {

                    user = new()
                    {
                        Email = req.Email,
                        PasswordSalt = passwordSalt,
                        HashPassword = passwordHash,
                        FirstName = req.FirstName,
                        LastName = req.LastName,
                        CreateAt = DateTime.UtcNow,
                        Role = Roles.Admin
                    };
                }
                else
                {
                    user = new()
                    {
                        Email = req.Email,
                        PasswordSalt = passwordSalt,
                        HashPassword = passwordHash,
                        FirstName = req.FirstName,
                        LastName = req.LastName,
                        CreateAt = DateTime.UtcNow
                    };
                }

                var userData = await _context.Users.AddAsync(user);

                string token;
                token = _token.GenerateToken(Convert.ToInt32(userData.Entity.Id), userData.Entity.Role);


                var Res = new
                {
                    token = token,
                    email = userData.Entity.Email,
                    fullName = userData.Entity.FirstName + " " + userData.Entity.LastName,
                    role = user.Role,
                    avatarUrl = user.AvatarUrl
                };


                _context.SaveChanges();

                string refreshToken = _token.GenerateRefreshToken(Convert.ToInt32(userData.Entity.Id));

                CookieOptions cookieOptions = new CookieOptions { Secure = true, HttpOnly = true, SameSite = SameSiteMode.Lax, Expires = DateTimeOffset.UtcNow.AddHours(4320) };
                Response.Cookies.Append("refresh-token", refreshToken, cookieOptions);

                return Ok(Res);
            }
            catch (Exception err)
            {
                throw err;
            }

        }

        [HttpPost("login"), AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto req)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(user => user.Email == req.Email);
                if (user == null) return BadRequest("User Not Found");


                bool isMatch = _password.VerifyPasswordHash(req.Password, user.HashPassword, user.PasswordSalt);
                if (!isMatch) return BadRequest("Password is Wrong");

                string token = _token.GenerateToken(Convert.ToInt32(user.Id), user.Role);

                var Res = new
                {
                    token = token,
                    email = user.Email,
                    fullName = user.FirstName + " " + user.LastName,
                    role = user.Role,
                    avatarUrl = user.AvatarUrl
                };

                string refreshToken = _token.GenerateRefreshToken(Convert.ToInt32(user.Id));

                CookieOptions cookieOptions = new CookieOptions { Secure = true, HttpOnly = true, SameSite = SameSiteMode.Lax, Expires = DateTimeOffset.UtcNow.AddHours(4320) };
                Response.Cookies.Append("refresh-token", refreshToken, cookieOptions);

                return Ok(Res);
            }
            catch (Exception err)
            {
                return BadRequest(err);
            }
        }

        [HttpGet("users"), Authorize]
        public IActionResult GetUsers()
        {
            var users = _context.Users.Where(user => user.Role != Roles.Admin).Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Role
            });
            return Ok(users);
        }

        [HttpGet("refresh-token")]
        public async Task<IActionResult> GetToken()
        {
            string? refreshToken = Request.Headers.Cookie.FirstOrDefault()?.Split('=')[1];

            if (refreshToken is null) return BadRequest("you need to login");

            int? userId = _token.VerifyToken(refreshToken);

            if (!Convert.ToBoolean(userId)) return BadRequest("something want wrong");

            var user = await _context.Users.FindAsync(userId);

            if (user is null) return BadRequest("user not found");

            string token = _token.GenerateToken((int)userId, user.Role);

            return Ok(token);
        }
    }
}
