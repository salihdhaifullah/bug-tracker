using System.Security.Cryptography;
using System.Text;

namespace Buegee.Services.CryptoService;

public class CryptoService : ICryptoService
{
    public void Hash(string source, out byte[] hash, out byte[] salt)
    {
        var hmac = new HMACSHA512();
        hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(source));
        salt = hmac.Key;
    }

    public void Compar(string source, byte[] hash, byte[] salt, out bool IsMatch)
    {
        var hmac = new HMACSHA512(salt);
        byte[] ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(source));
        IsMatch = ComputeHash.SequenceEqual(hash);
    }
}
