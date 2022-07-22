using Microsoft.AspNetCore.Mvc;
using server.Data;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Services.PasswardServices;
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
        private readonly IPasswardServices _passward;

        public AuthController(UserDataContex contex, IEmailServices email, IJsonWebToken token, IPasswardServices passward)
        {
            _contex = contex;
            _email = email;
            _token = token;
            _passward = passward;
        }


        [HttpPost("Singin")]
        public async Task<IActionResult> SingIn(UserSigninReq req)
        {
            bool IsFound = _contex.Users.Any(user => user.Email == req.Email);
            if (IsFound) return BadRequest("User Allredy Exsist");

            _passward.CreatePasswardHash(req.Passward, out string passwardHash, out string passwardSalt);

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
            var user = await _contex.Users.FirstOrDefaultAsync(user => user.Email == req.Email);
            if (user == null) return BadRequest("User Not Found");
            bool isMatsh = _passward.VerifyPasswardHash(req.Passward, user.HashPassward, user.PasswardSalt);
            if (!isMatsh) return BadRequest("Passward is Wrong");

            return Ok("Login Sucses");
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

            Request.Headers.Add("Authorization", "Bearer " + token);
            return Ok(token);
        }

        [HttpGet("virfy")]
        public IActionResult Virfy([FromQuery] string token)
        {
            int? isValid = _token.VirfiyToken(token);
            if (!Convert.ToBoolean(isValid)) return BadRequest("Token is not Valid");
            return Ok("Token is Valid");
        }

    }
}
