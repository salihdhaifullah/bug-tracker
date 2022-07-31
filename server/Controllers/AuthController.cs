using Microsoft.AspNetCore.Mvc;
using server.Data;
using Microsoft.EntityFrameworkCore;
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

        private class SuccessRes
        {
            public string Token { get; set; }
            public User User { get; set; }
        }


        [HttpPost("Singin"), AllowAnonymous]
        public async Task<IActionResult> SingIn(UserSinginReq req)
        {
            try
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
            catch (Exception err)
            {
                throw err;
            }

        }

        [HttpPost("login"), AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginReq req)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(user => user.Email == req.Email);
                if (user == null) return BadRequest("User Not Found");


                bool isMatch = _password.VerifyPasswordHash(req.Password, user.HashPassword, user.PasswordSalt);
                if (!isMatch) return BadRequest("Password is Wrong");

                string token;
                if (req.Password == _configuration.GetSection("Admin:Password").Value && req.Email == _configuration.GetSection("Admin:Email").Value) 
                                    token = _token.GenerateToken(Convert.ToInt32(user.Id), Roles.Admin);
                
                else  token = _token.GenerateToken(Convert.ToInt32(user.Id), null);
                
                var Res = new SuccessRes()
                {
                    Token = token,
                    User = user
                };
                return Ok(Res);
            }
            catch (Exception err)
            {
                throw err;
            }
        }


        [HttpGet, Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users.Select(u => new
                {
                    u.CreateAt,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Id
                }).ToListAsync();

                return Ok(users);
            }
            catch (Exception err)
            {
                throw err;
            }
        }

    }
}
