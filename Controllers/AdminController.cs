using Buegee.Models.VM;
using Buegee.Models.DB;
using Buegee.Services.AuthService;
using Buegee.Services.EmailService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace Buegee.Controllers;

[Controller]
[Route("admin")]
public class AdminController : Controller
{

    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly IEmailService _email;
    private readonly IDatabase _cache;

    public AdminController(DataContext ctx, IAuthService auth, IEmailService email, IDatabase cache)
    {
        _ctx = ctx;
        _auth = auth;
        _email = email;
        _cache = cache;
    }

    [HttpGet("create-project")]
    public async Task<IActionResult> CreateProject()
    {
        var projectMangers = await _ctx.Users
            .Where(u => u.Role == Roles.PROJECT_MANGER)
            .Select(u => new {
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
    public async Task<IActionResult> MangeUsers() {
        var users = await _ctx.Users
            .Select(u => new MangeUsersVM.User {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role
            })
            .ToListAsync();

        var data = new MangeUsersVM() { Users = users};

        return View(data);
    }

}
