using Buegee.Models.VM;
using Buegee.Services.AuthService;
using Buegee.Services.EmailService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Services.RedisCacheService;
using Buegee.Services.CryptoService;
using Buegee.Data;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;

namespace Buegee.Controllers;

[ApiRoute("admin")]
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
        var result = _auth.CheckPermissions(HttpContext, new List<Roles>{Roles.ADMIN}, out var ID);

        if(result is not null) return result;

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
    public async Task<IActionResult> MangeUsers([FromRoute] int page = 1)
    {
        var result = _auth.CheckPermissions(HttpContext, new List<Roles>{Roles.ADMIN}, out var ID);

        if(result is not null) return result;

        try
        {
        var usersCount = await _ctx.Users.Where(u => u.Role != Roles.ADMIN).CountAsync();
        var pages = Math.Ceiling((double)usersCount / 10);

        var users = await _ctx.Users
            .Where(u => u.Role != Roles.ADMIN)
            .OrderBy(u => u.CreatedAt)
            .Select(u => new MangeUsersVM.User
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                ImageId = u.ImageId
            })
            .Skip((page - 1) * 10)
            .Take(10)
            .ToListAsync();

        var data = new MangeUsersVM() { Users = users, Pages = pages, CurrentPage = (double)page };
        return View(data);
        }
        catch (System.Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

    }

    [HttpGet("change-role/{userId}")]
    public async Task<IActionResult> ChangeRole([FromRoute] int userId)
    {
        var result = _auth.CheckPermissions(HttpContext, new List<Roles>{Roles.ADMIN}, out var ID);
        if(result is not null) return result;

        var user = await _ctx.Users.Where(u => u.Id == userId)
            .Select(u => new ChangeRoleVM
            {
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                ImageId = u.ImageId
            })
            .FirstOrDefaultAsync();

        if (user is null) return NotFound();

        ViewBag.FirstName = user.FirstName;
        ViewBag.Email = user.Email;
        ViewBag.LastName = user.LastName;
        ViewBag.ImageId = user.ImageId;
        ViewBag.Role = user.Role;
        ViewBag.Id = userId;

        return View(new ChangeRoleVM.ChangeRoleVMDto() { NewRole = "" });
    }

    [HttpPost("change-role/{userId}")]
    public async Task<IActionResult> ChangeRole([FromRoute] int userId, [FromForm] ChangeRoleVM.ChangeRoleVMDto data)
    {
        var result = _auth.CheckPermissions(HttpContext, new List<Roles>{Roles.ADMIN}, out var ID);
        if(result is not null) return result;

        if (!ModelState.IsValid)
        {
            var user = await _ctx.Users.Where(u => u.Id == userId)
            .Select(u => new ChangeRoleVM
            {
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                ImageId = u.ImageId
            }).FirstOrDefaultAsync();

            if (user is null) return NotFound();

            ViewBag.FirstName = user.FirstName;
            ViewBag.Email = user.Email;
            ViewBag.LastName = user.LastName;
            ViewBag.Image = user.ImageId;
            ViewBag.Role = user.Role;
            ViewBag.Id = userId;

            return View(data);
        }

        var isFound = await _ctx.Users.FindAsync(userId);
        if (isFound is null) return NotFound();
        await _email.roleChangedEmail(isFound.Email, $"{isFound.FirstName} {isFound.LastName}", isFound.Role.ToString(), data.NewRole);
        isFound.Role = Enum.Parse<Roles>(data.NewRole);
        await _ctx.SaveChangesAsync();
        return Redirect("/admin/mange-users");
    }


}
