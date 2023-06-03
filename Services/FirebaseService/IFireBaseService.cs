using Buegee.Utils.Enums;

namespace Buegee.Services.FirebaseService;
public interface IFirebaseService
{
    public Task<string> Upload(byte[] data, ContentTypes ContentType);
    public Task Delete(string url);
    public Task Update(string url, byte[] data);
}
