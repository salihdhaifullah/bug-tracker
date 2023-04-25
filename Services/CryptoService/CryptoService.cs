using System.Security.Cryptography;
using System.Text;

namespace Buegee.Services.CryptoService;

public class CryptoService : ICryptoService
{
    public (byte[] hash, byte[] salt) Hash(string source)
    {
        var hmac = new HMACSHA512();
        return (hmac.ComputeHash(Encoding.UTF8.GetBytes(source)), hmac.Key);
    }

    public bool Compar(string source, byte[] hash, byte[] salt)
    {
        var hmac = new HMACSHA512(salt);
        byte[] ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(source));
        return ComputeHash.SequenceEqual(hash);
    }
}
