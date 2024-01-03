namespace Buegee.Services.SupabaseService;
public interface ISupabaseService
{
    public Task<string> Upload(byte[] data, string ContentType);
    public Task Delete(string url);
    public Task<string> Update(string url, string ContentType, byte[] data);
}
