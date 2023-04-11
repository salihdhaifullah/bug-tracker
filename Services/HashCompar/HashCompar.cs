using System.Security.Cryptography;

namespace bug_tracker.Services.HashCompar
{
    public class HashCompar : IHashCompar
    {
        public (byte[] hash, byte[] salt) Hash(string source)
        {
            using (var hmac = new HMACSHA512())
            {
                return (hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(source)), hmac.Key);
            }
        }

        public bool Compar(string source, byte[] hash, byte[] salt)
        {
            using (var hmac = new HMACSHA512(salt))
            {
                byte[] ComputeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(source));
                return ComputeHash.SequenceEqual(hash);
            }
        }
    }
}
