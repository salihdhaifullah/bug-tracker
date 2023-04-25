namespace Buegee.Services.CryptoService;

public interface ICryptoService
{
    public (byte[] hash, byte[] salt) Hash(string source);
    public bool Compar(string source, byte[] hash, byte[] salt);
}
