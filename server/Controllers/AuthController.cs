using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using System.Security.Cryptography;
using server.Services.EmailServices;
using server.Services.JsonWebToken;
namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserDataContex _contex;
        private readonly IEmailServices _email;
        private readonly IJsonWebToken _token;

        public AuthController(UserDataContex contex, IEmailServices email, IJsonWebToken token)
        {
            _contex = contex;
            _email = email;
            _token = token;
        }


        [HttpPost("Singin")]
        public async Task<IActionResult> SingIn(UserSigninReq req)
        {
            bool IsFound = _contex.Users.Any(user => user.Email == req.Email);
            if (IsFound) return BadRequest("User Allredy Exsist");

            CreatePasswardHash(req.Passward, out string passwardHash, out string passwardSalt);

            User user = new()
            {
                Email = req.Email,
                PasswardSalt = passwardSalt,
                HashPassward = passwardHash,
                FirstName = req.FirstName,
                LastName = req.LastName,
                CreateAt = DateTime.UtcNow
            };

            _contex.Users.Add(user);
            await _contex.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginReq req)
        {
            var user = _contex.Users.FirstOrDefaultAsync(user => user.Email == req.Email);
            ; if (user.Result == null) return BadRequest("User Not Found");
            bool isMatsh = VerifyPasswardHash(req.Passward, user.Result.HashPassward, user.Result.PasswardSalt);
            if (!isMatsh) return BadRequest("Passward is Wrong");

            return Ok("Login Sucses");
        }

        [HttpPost("hello")]
        public async Task<IActionResult> SendEmail(EmailDto req)
        {
            try
            {
                _email.SendEmail(req);

                return Ok("Email Send");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("token")]
        public async Task<IActionResult> SendToken([FromQuery] string id)
        {
            string token = _token.GenerateToken(Convert.ToInt32(id));
            return Ok(token);
        }

        [HttpGet("virfy")]
        public async Task<IActionResult> Virfy([FromQuery] string token)
        {
            int? isValid = _token.VirfiyToken(token);
            if (!Convert.ToBoolean(isValid)) return BadRequest("Token is not Valid");
            return Ok("Token is Valid");
        }
            
        private void CreatePasswardHash(string passward, out string passwardHash, out string passwardSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwardSalt = Convert.ToBase64String(hmac.Key);
                passwardHash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passward)));
            }
        }

        private bool VerifyPasswardHash(string passward, string passwardHash, string passwardSalt)
        {
            using (var hmac = new HMACSHA512(Convert.FromBase64String(passwardSalt)))
            {
                byte[] ComputeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passward));
                return ComputeHash.SequenceEqual(Convert.FromBase64String(passwardHash));
            }
        }


    }
}
