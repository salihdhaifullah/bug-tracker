using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Buegee.Utils.Utils;

[ApiRoute("project")]
[Consumes("application/json")]
public class ProjectController : Controller
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;

    public ProjectController(DataContext ctx, IAuthService auth)
    {
        _auth = auth;
        _ctx = ctx;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;


        var isFound = await _ctx.Projects.AnyAsync((p) => p.Name == dto.Name && p.Team.OwnerId == userId);

        if (isFound) return new HttpResult()
                            .IsOk(false)
                            .Message($"there a project name with the same name as {dto.Name}, please chose another name")
                            .StatusCode(400).Get();


        var team = _ctx.Teams.Add(new Team() { OwnerId = userId });

        await _ctx.SaveChangesAsync();

        var data = _ctx.Projects.Add(new Project()
        {
            Name = dto.Name,
            IsPrivate = dto.IsPrivate,
            TeamId = team.Entity.Id
        });

        await _ctx.SaveChangesAsync();

        return new HttpResult()
                            .IsOk(true)
                            .Body(new {data.Entity.Team, data.Entity.CreatedAt, data.Entity.IsPrivate, data.Entity.Name, data.Entity.Id})
                            .Message($"project {dto.Name} successfully created")
                            .Get();
    }
}
