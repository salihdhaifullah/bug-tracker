using System.Text.Json;
using Buegee.Models.DB;
using Buegee.Services;
using Buegee.Services.CryptoService;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Extensions.Data;

public class Seed
{
    private readonly DataContext _ctx;
    private readonly Data _data;
    private readonly ICryptoService _crypto = new CryptoService();
    private readonly HttpClient _client = new HttpClient();

    public Seed(DataContext ctx)
    {
        Console.WriteLine("\n\n ************************************************************** \n\n");
        Console.WriteLine("\n\n\n\n\n\n  Seeding Data Safely To The Database \n\n\n\n\n\n");
        Console.WriteLine("\n\n ************************************************************** \n\n");

        _ctx = ctx;
        var Json = File.ReadAllText("data.json");
        if (Json is null) throw new Exception("data.json is not found");

        var isData = JsonSerializer.Deserialize<Data>(Json);
        if (isData is not null) _data = isData;
        else _data = new Data(new List<User>());
    }

    public async Task SeedAsync()
    {
        await SeedUsersAsync();
    }

    private record User(string Role, string FirstName, string LastName, string Email, string Image);
    private record Data(List<User> Users);

    private async Task SeedUsersAsync()
    {
        foreach (var item in _data.Users)
        {
            var isFound = await _ctx.Users.AnyAsync(u => u.Email == item.Email);

            if (isFound) continue;

            var (hash, salt) = _crypto.Hash(item.Email);

            var isPared = Enum.TryParse(item.Role, out Roles userRole);

            Roles Role = isPared ? userRole : Roles.REPORTER;

            var imageBytes = await _client.GetByteArrayAsync(item.Image);

            var data = new UserDB()
            {
                FirstName = item.FirstName,
                LastName = item.LastName,
                Email = item.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = Role,
                Image = imageBytes
            };

            _ctx.Users.Add(data);
        }

        await _ctx.SaveChangesAsync();
    }
}
