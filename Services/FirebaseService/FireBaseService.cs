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

    public async Task<string> Upload(byte[] data, ContentTypes ContentType)
    {
        return await _storage.Child($"{Guid.NewGuid()}.{ContentType.ToString()}").PutAsync(new MemoryStream(data));
    }

    public async Task Delete(string url)
    {
        var items = url.Split("/");
        await _storage.Child(items[items.Length - 1]).DeleteAsync();
    }

    public async Task Update(string url, byte[] data)
    {
        var items = url.Split("/");
        await _storage.Child(items[items.Length - 1]).PutAsync(new MemoryStream(data));
    }
}
