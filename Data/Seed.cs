using System.Text.Json;
using Buegee.Services.CryptoService;
using Buegee.Utils.Enums;
using Buegee.Models;
using Microsoft.EntityFrameworkCore;
using Buegee.Services.FirebaseService;

namespace Buegee.Data;

public class Seed
{
    private readonly DataContext _ctx;
    private readonly Data _data;
    private readonly ICryptoService _crypto;
    private readonly HttpClient _client;
    private readonly IFirebaseService _firebase;

    public Seed(DataContext ctx, ICryptoService crypto, IFirebaseService firebase)
    {
        Console.WriteLine("\n ************************************************************** \n");
        Console.WriteLine("************************************************************** \n");
        Console.WriteLine("************************************************************** \n");
        Console.WriteLine("\n\n\n\n\n\n  Seeding Data Safely To The Database \n\n\n\n\n\n");
        Console.WriteLine("\n ************************************************************** \n");
        Console.WriteLine("************************************************************** \n");
        Console.WriteLine("************************************************************** \n");

        _ctx = ctx;
        _crypto = crypto;
        _firebase = firebase;

        var json = File.ReadAllText("data.json");
        if (json is null) throw new Exception("data.json is not found");

        var isData = JsonSerializer.Deserialize<Data>(json);

        if (isData is not null) _data = isData;
        else _data = new Data(new List<UserSeed>());

        _client = new HttpClient();
    }

    public async Task SeedAsync()
    {
        await SeedUsersAsync();
    }

    private record UserSeed(string FirstName, string LastName, string Email, string? Image);
    private record Data(List<UserSeed> Users);

    private async Task SeedUsersAsync()
    {
        foreach (var item in _data.Users)
        {
            var isFound = await _ctx.Users.AnyAsync(u => u.Email == item.Email);

            if (isFound) continue;

            _crypto.Hash(item.Email, out byte[] hash, out byte[] salt);

            string url;

            if (item.Image is not null)
            {
                var imageBytes = await _client.GetByteArrayAsync(item.Image);
                url = await _firebase.Upload(imageBytes, ContentTypes.jpeg);
            }
            else
            {
                var imageBytes = await _client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={item.FirstName}-{item.LastName}-{item.Email}");
                url = await _firebase.Upload(imageBytes, ContentTypes.svg);
            }

            var user = await _ctx.Users.AddAsync(new User()
            {
                FirstName = item.FirstName,
                LastName = item.LastName,
                Email = item.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                ImageUrl = url
            });

        }

        await _ctx.SaveChangesAsync();
    }
}
