namespace Buegee.Services.FirebaseService;
public interface IFirebaseService
{
    public Task<string> Upload(byte[] data, string ContentType);
    public Task Delete(string name);
    public Task<string> Update(string name, string ContentType, byte[] data);
}
