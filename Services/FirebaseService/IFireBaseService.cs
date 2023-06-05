using Buegee.Utils.Enums;

namespace Buegee.Services.FirebaseService;
public interface IFirebaseService
{
    public Task<(string url, string name)> Upload(byte[] data, ContentTypes ContentType);
    public Task Delete(string name);
    public Task Update(string name, byte[] data);
}
