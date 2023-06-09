using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Firebase.Storage;
using FirebaseAdmin.Auth;
using Buegee.Utils.Enums;

namespace Buegee.Services.FirebaseService;
public class FirebaseService : IFirebaseService
{
    private readonly FirebaseStorage _storage;

    public FirebaseService(IConfiguration config)
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
    }

    public async Task<string> Upload(byte[] data, ContentTypes ContentType)
    {
        var name = $"{Guid.NewGuid()}.{ContentType.ToString()}";
        await _storage.Child(name).PutAsync(new MemoryStream(data));
        return name;
    }

    public async Task Delete(string name)
    {
        await _storage.Child(name).DeleteAsync();
    }

    public async Task<string> Update(string oldName, ContentTypes ContentType, byte[] data)
    {
        await Delete(oldName);
        var name = $"{Guid.NewGuid()}.{ContentType.ToString()}";
        await _storage.Child(name).PutAsync(new MemoryStream(data));
        return name;
    }
}
