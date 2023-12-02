namespace Buegee.Services.FirebaseService;
public interface IFirebaseService
{
    public Task<string> Upload(byte[] data, string ContentType);
    public Task Delete(string url);
    public Task<string> Update(string url, string ContentType, byte[] data);
}
