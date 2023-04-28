using Buegee.Models.VM;
using Buegee.Models.DB;
using Buegee.Services.AuthService;
using Buegee.Services.EmailService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Services.RedisCacheService;
using System.Net;
using System.Text;
using System.Text.Json;
using Buegee.Services.CryptoService;
using Buegee.Services;

namespace Buegee.Controllers;

[Controller]
[Route("admin")]
public class AdminController : Controller
{

    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly IEmailService _email;
    private readonly IRedisCacheService _cache;
    private readonly ICryptoService _crypto;

    public AdminController(DataContext ctx, IAuthService auth, IEmailService email, IRedisCacheService cache, ICryptoService crypto)
    {
        _ctx = ctx;
        _auth = auth;
        _email = email;
        _cache = cache;
        _crypto = crypto;
    }

    [HttpGet("create-project")]
    public async Task<IActionResult> CreateProject()
    {
        var projectMangers = await _ctx.Users
            .Where(u => u.Role == Roles.PROJECT_MANGER)
            .Select(u => new
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .ToListAsync();

        ViewData["data"] = new string[] { "you", "Mom", "Cat", "Dog", "Monkey", "Banana" };
        return View();
    }

    [HttpGet("mange-users")]
    public async Task<IActionResult> MangeUsers()
    {
        var users = await _ctx.Users
            .Select(u => new MangeUsersVM.User
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                Image = u.Image
            })
            .ToListAsync();

        var data = new MangeUsersVM() { Users = users };
        return View(data);
    }


    [HttpGet("only-bytes")]
    public async Task<string> OnlyBytes()
    {
        Response.Headers.Append("Access-Control-Allow-Origin", "*");
        return $"data:image/jpg;base64,{Convert.ToBase64String(await System.IO.File.ReadAllBytesAsync("only-bytes"))}";
    }

    [HttpGet("seed-data")]
    public async Task SeedData()
    {
        try
        {
            HttpClient client = new HttpClient();

            string json = await System.IO.File.ReadAllTextAsync("data.json");
            var people = JsonSerializer.Deserialize<List<UserData>>(json);
            foreach (var item in people)
            {
                var isPared = Enum.TryParse(item.Role, out Roles userRole);
                Roles Role  = isPared ? userRole : Roles.REPORTER;
                var imageBytes = await client.GetByteArrayAsync(item.Image);

                var (hash, salt) = _crypto.Hash(item.Email);

               var data = new UserDB(){
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
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }

    public record UserData(string Role, string FirstName, string LastName, string Email, string Image);

}
