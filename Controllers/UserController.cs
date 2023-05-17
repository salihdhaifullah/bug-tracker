using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("user")]
public class UserController : Controller {
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;

    public UserController(DataContext ctx, IAuthService auth) {
        _auth = auth;
        _ctx = ctx;
    }


    [HttpGet("how-am-i")]
    public async Task<IActionResult> GetUserByToken() {
        if (!_auth.TryGetUser(HttpContext, out var user) || user is null) return new HttpResult().IsOk(false).StatusCode(401).Get();

        var isFound = await _ctx.Users
        .Where((u) => u.Id == user.Id)
        .Select((u) => new {
            id = u.Id,
            role = u.Role.ToString(),
            imageId = u.ImageId,
            email = u.Email,
            fullName = $"{u.FirstName} {u.LastName}"
        })
        .FirstOrDefaultAsync();

        if (isFound is null) return new HttpResult()
                                .IsOk(false)
                                .StatusCode(404)
                                .Get();

        return new HttpResult()
                .IsOk(true)
                .StatusCode(200)
                .Body(isFound)
                .Get();
    }

    [HttpGet("project-mangers")]
    public async Task<IActionResult> ProjectMangers()
    {
        Console.WriteLine("RUNNING api/user/project-mangers");

        var result = _auth.CheckPermissions(HttpContext, new List<Roles>{Roles.admin});

        if(result is not null) return result;

        var projectMangers = await _ctx.Users
            .Where(u => u.Role == Roles.project_manger)
            .Select(u => new {
                id = u.Id,
                fullName = $"{u.FirstName} {u.LastName}"
            })
            .ToListAsync();


        return new HttpResult().IsOk(true).StatusCode(200).Body(projectMangers).Get();
    }
}
