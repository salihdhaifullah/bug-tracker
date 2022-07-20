using Microsoft.AspNetCore.Mvc;
using server.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace server.Controllers
{
    [Route("api/singin")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public static User user = new User();

        public static string HashPassword(string passward)
        {
            byte[] salt = new byte[128 / 8];
            using (var rngCsp = new RNGCryptoServiceProvider())
            {
                rngCsp.GetNonZeroBytes(salt);
            }
            Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: passward,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            Console.WriteLine($"Hashed: {hashed}");

            return hashed;
        }

        public static bool VirfiyPassword(string passward, string hashedPassward)
        {
            string userpassward = HashPassword(passward);

            if (userpassward == hashedPassward) return true;
            else return false;

        }
        [HttpPost("SingIn")]
        public ActionResult<User> SingIn(UserREG data)
        { 
            user.Id = 1;
            user.HashPassward = HashPassword(data.Passward);
            user.Age = data.Age;
            user.Email = data.Email;
            user.LastName = data.LastName;
            user.FirstName = data.FirstName;

            return Ok(user);
        }

        [HttpPost("Login")]
        public ActionResult<User> Login(UserREG data)
        {
            // test 
            string hashedPassward = HashPassword("hello");
            bool isMatsh = VirfiyPassword(data.Passward, hashedPassward);

            if (isMatsh) return Ok("Login Good");
            else return NotFound("sorray Login fild");
        }

        [HttpGet("Logout")]
        public ActionResult Logout()
        {
            // test
            return Ok("Logout scuseful");
        }
    }
}
