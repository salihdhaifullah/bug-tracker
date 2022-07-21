using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using System.Security.Cryptography;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserDataContex _contex;
        public AuthController(UserDataContex contex)
        {
            _contex = contex;
        }

        [HttpPost("Singin")]
        public async Task<IActionResult> SingIn(UserReq req)
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

        private void CreatePasswardHash(string passward, out string passwardHash, out string passwardSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwardSalt = Convert.ToBase64String(hmac.Key);
                passwardHash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passward)));
            }
        }
    }
}
