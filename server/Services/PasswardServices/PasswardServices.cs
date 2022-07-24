using System.Security.Cryptography;
namespace server.Services.PasswordServices
{
    public class PasswordServices : IPasswordServices
    {
        public void CreatePasswordHash(string password, out string passwordHash, out string passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = Convert.ToBase64String(hmac.Key);
                passwordHash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));
            }
        }

        public bool VerifyPasswordHash(string password, string passwordHash, string passwordSalt)
        {
            using (var hmac = new HMACSHA512(Convert.FromBase64String(passwordSalt)))
            {
                byte[] ComputeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return ComputeHash.SequenceEqual(Convert.FromBase64String(passwordHash));
            }
        }
    }
}
