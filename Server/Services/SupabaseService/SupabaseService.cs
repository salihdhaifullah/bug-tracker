using Buegee.Utils;
using Supabase;

namespace Buegee.Services.SupabaseService;
public class SupabaseService : ISupabaseService
{
    private readonly Client _storage;

    public SupabaseService(IConfiguration config)
    {
        var url = config.GetSection("Supabase").GetValue<string>("Url") ?? throw new NullReferenceException("Supabase not configured");
        var key = config.GetSection("Supabase").GetValue<string>("Key") ?? throw new NullReferenceException("Supabase not configured"); ;

        _storage = new Client(url, key, new SupabaseOptions { AutoRefreshToken = false });
    }

    public async Task<string> Upload(byte[] data, string ContentType)
    {
        var name = $"{Guid.NewGuid()}.{ContentType}";
        var url = await _storage.Storage
            .From("dev")
            .Upload(data, name, new Supabase.Storage.FileOptions { Upsert = true, ContentType = Helper.GetContentType(name) });
        return $"https://qganriahkcsgwxbiefuo.supabase.co/storage/v1/object/public/{url}";
    }

    public async Task Delete(string url)
    {
        await _storage.Storage
        .From("dev")
        .Remove(url.Replace("https://qganriahkcsgwxbiefuo.supabase.co/storage/v1/object/public/dev/", ""));
    }

    public async Task<string> Update(string url, string ContentType, byte[] data)
    {
        await Delete(url);
        return await Upload(data, ContentType);
    }
}
