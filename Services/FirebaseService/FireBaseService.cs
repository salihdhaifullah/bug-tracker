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

        var token = defaultAuth.CreateCustomTokenAsync(uid);

        _storage = new FirebaseStorage("bug-tracker-buegee.appspot.com", new FirebaseStorageOptions
        {
            AuthTokenAsyncFactory = async () => await token,
            ThrowOnCancel = true,
        });
    }

    public async Task<(string url, string name)> Upload(byte[] data, ContentTypes ContentType)
    {
        var name = $"{Guid.NewGuid()}.{ContentType.ToString()}";
        return (await _storage.Child(name).PutAsync(new MemoryStream(data)), name);
    }

    public async Task Delete(string name)
    {
        await _storage.Child(name).DeleteAsync();
    }

    public async Task Update(string name, byte[] data)
    {
        await _storage.Child(name).PutAsync(new MemoryStream(data));
    }
}
