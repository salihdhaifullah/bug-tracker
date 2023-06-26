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
        else _data = new Data(new List<userSeed>(), new List<projectSeed>());

        _client = new HttpClient();
    }

    public async Task SeedAsync()
    {
        await seedUsersAsync();
        await seedProjectsAsync();
    }

    private record member(string Role, string Email);
    private record userSeed(string FirstName, string LastName, string Email, string? Image);
    private record projectSeed(string Name, string Content, bool IsPrivate, List<member> Members);
    private record Data(List<userSeed> Users, List<projectSeed> Projects);

    private async Task seedUsersAsync()
    {
        foreach (var item in _data.Users)
        {
            var isFound = await _ctx.Users.AnyAsync(u => u.Email == item.Email);

            if (isFound) continue;

            _crypto.Hash(item.Email, out byte[] hash, out byte[] salt);

            var userId = Ulid.NewUlid().ToString();
            var contentId = Ulid.NewUlid().ToString();
            string imageName;

            if (item.Image is not null)
            {
                var imageBytes = await _client.GetByteArrayAsync(item.Image);
                imageName = await _firebase.Upload(imageBytes, ContentType.jpeg);
            }
            else
            {
                var imageBytes = await _client.GetByteArrayAsync($"https://api.dicebear.com/6.x/identicon/svg?seed={userId.ToString()}");
                imageName = await _firebase.Upload(imageBytes, ContentType.svg);
            }

            var content = await _ctx.Contents.AddAsync(new Content() { Id = contentId });
            var user = await _ctx.Users.AddAsync(new User
            {
                FirstName = item.FirstName,
                LastName = item.LastName,
                Email = item.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Id = userId,
                ContentId = contentId,
                ImageName = imageName
            });
        }

        await _ctx.SaveChangesAsync();
    }

    private async Task seedProjectsAsync()
    {
        foreach (var item in _data.Projects)
        {
            var contentId = Ulid.NewUlid().ToString();
            var projectId = Ulid.NewUlid().ToString();
            var activateId = Ulid.NewUlid().ToString();

            await _ctx.Activities.AddAsync(new Activity() { ProjectId = projectId, Markdown = $"created project {item.Name}", Id = activateId });
            await _ctx.Contents.AddAsync(new Content() { Id = contentId, Markdown = item.Content });
            await _ctx.Projects.AddAsync(new Project()
            {
                Name = item.Name,
                IsPrivate = item.IsPrivate,
                Id = projectId,
                ContentId = contentId
            });

            foreach (var member in item.Members)
            {
                var user = await _ctx.Users.Where(u => u.Email == member.Email).Select(u => new { Id = u.Id }).FirstOrDefaultAsync();
                if (user is null) continue;
                var memberId = Ulid.NewUlid().ToString();
                var role = Enum.Parse<Role>(member.Role);
                await _ctx.Members.AddAsync(new Member() { UserId = user.Id, Id = memberId, ProjectId = projectId, Role = role });
            }
        }

        await _ctx.SaveChangesAsync();
    }
}
