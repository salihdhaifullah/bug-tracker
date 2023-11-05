using Buegee.Utils.Enums;

namespace Buegee.Services.FirebaseService;
public interface IFirebaseService
{
    public Task<string> Upload(byte[] data, ContentType ContentType);
    public Task Delete(string name);
    public Task<string> Update(string name, ContentType ContentType, byte[] data);
}
