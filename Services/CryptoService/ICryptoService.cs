namespace Buegee.Services.CryptoService;

public interface ICryptoService
{
    public void Hash(string source, out byte[] hash, out byte[] salt);
    public void Compar(string source, byte[] hash, byte[] salt, out bool isMatch);
}
