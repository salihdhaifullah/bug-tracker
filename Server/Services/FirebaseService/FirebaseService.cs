using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Firebase.Storage;
using FirebaseAdmin.Auth;

namespace Buegee.Services.FirebaseService;
public class FirebaseService : IFirebaseService
{
    private readonly FirebaseStorage _storage;
    private readonly ILogger<FirebaseService> _logger;

    public FirebaseService(IConfiguration config, ILogger<FirebaseService> logger)
    {
        var uid = config.GetSection("Firebase").GetValue<string>("Id");

        var defaultApp = FirebaseApp.Create(new AppOptions() { Credential = GoogleCredential.FromFile("firebase-sdk.json") });

        var defaultAuth = FirebaseAuth.GetAuth(defaultApp);

        var tokenAsync = defaultAuth.CreateCustomTokenAsync(uid);

        _storage = new FirebaseStorage("bug-tracker-buegee.appspot.com", new FirebaseStorageOptions
        {
            AuthTokenAsyncFactory = async () => await tokenAsync,
            ThrowOnCancel = true,
        });
        _logger = logger;
    }

    public async Task<string> Upload(byte[] data, string ContentType)
    {
        var name = $"{Guid.NewGuid()}.{ContentType}";
        await _storage.Child(name).PutAsync(new MemoryStream(data));
        var url = await _storage.Child(name).GetDownloadUrlAsync();
        return url;
    }

    public async Task Delete(string url)
    {
        var uri = new Uri(url);
        _logger.LogWarning($"\n\n\n the url is \n Url: \"{url}\" \n Name: \"{Path.GetFileName(uri.AbsolutePath)}\"  \n\n\n");
        await _storage.Child(Path.GetFileName(uri.AbsolutePath)).DeleteAsync();
    }

    public async Task<string> Update(string url, string ContentType, byte[] data)
    {
        await Delete(url);
        var name = $"{Guid.NewGuid()}.{ContentType}";
        await _storage.Child(name).PutAsync(new MemoryStream(data));
        return await _storage.Child(name).GetDownloadUrlAsync();
    }
}
