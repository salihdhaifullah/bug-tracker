using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("user")]
[Consumes("application/json")]
public class UserController : Controller {
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;

    public UserController(DataContext ctx, IAuthService auth) {
        _auth = auth;
        _ctx = ctx;
    }


    [HttpGet("project-mangers")]
    public async Task<IActionResult> ProjectMangers()
    {
        Console.WriteLine("RUNNING api/user/project-mangers");

        var result = _auth.CheckPermissions(HttpContext);

        if(result is not null) return result;

        var projectMangers = await _ctx.Users
            .Select(u => new {
                id = u.Id,
                fullName = $"{u.FirstName} {u.LastName}"
            })
            .ToListAsync();


        return new HttpResult().IsOk(true).StatusCode(200).Body(projectMangers).Get();
    }
}
