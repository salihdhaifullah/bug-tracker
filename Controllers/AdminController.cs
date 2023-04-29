using Buegee.Models.VM;
using Buegee.Models.DB;
using Buegee.Services.AuthService;
using Buegee.Services.EmailService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Services.RedisCacheService;
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


    [HttpGet("mange-users/{page?}")]
    public async Task<IActionResult> MangeUsers([FromRoute] int page)
    {
        var usersCount = await _ctx.Users.Where(u => u.Role != Roles.ADMIN).CountAsync();
        var pages = Math.Ceiling((decimal)usersCount / 10);

        var users = await _ctx.Users
            .Where(u => u.Role != Roles.ADMIN)
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

        var data = new MangeUsersVM() { Users = users, Pages = pages };
        return View(data);
    }


}
