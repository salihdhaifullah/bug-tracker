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
        var name = $"{Guid.NewGuid()}.{ContentType.ToString()}";
        await _storage.Child(name).PutAsync(new MemoryStream(data));
        return name;
    }

    public async Task Delete(string name)
    {
        await _storage.Child(name).DeleteAsync();
    }

    public async Task<string> Update(string oldName, string ContentType, byte[] data)
    {
        try
        {
            await Delete(oldName);
        }
        catch (Exception e)
        {
            _logger.LogError($"Filed to delete file {oldName}, \n error massage {e.Message}");
        }

        var name = $"{Guid.NewGuid()}.{ContentType.ToString()}";
        await _storage.Child(name).PutAsync(new MemoryStream(data));
        return name;
    }
}
