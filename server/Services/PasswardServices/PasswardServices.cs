using System.Security.Cryptography;
namespace server.Services.PasswardServices
{
    public class PasswardServices : IPasswardServices
    {
        public void CreatePasswardHash(string passward, out string passwardHash, out string passwardSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwardSalt = Convert.ToBase64String(hmac.Key);
                passwardHash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passward)));
            }
        }

        public bool VerifyPasswardHash(string passward, string passwardHash, string passwardSalt)
        {
            using (var hmac = new HMACSHA512(Convert.FromBase64String(passwardSalt)))
            {
                byte[] ComputeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passward));
                return ComputeHash.SequenceEqual(Convert.FromBase64String(passwardHash));
            }
        }
    }
}
