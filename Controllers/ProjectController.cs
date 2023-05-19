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
                            .Body(new { data.Entity.Team, data.Entity.CreatedAt, data.Entity.IsPrivate, data.Entity.Name, data.Entity.Id })
                            .Message($"project {dto.Name} successfully created")
                            .Get();
    }

    [HttpGet("{page?}")]
    public async Task<IActionResult> GetMyProjects([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var user) || user is null) return new HttpResult().IsOk(true).Message("no projects found for you, to create project please sing-up").StatusCode(404).Get();

        var projects = await _ctx.Projects
                        .Where((p) => p.Team.OwnerId == user.Id)
                        .OrderBy((p) => p.CreatedAt)
                        .Select((p) => new
                        {
                            createdAt = p.CreatedAt,
                            id = p.Id,
                            isPrivate = p.IsPrivate,
                            name = p.Name
                        })
                        .Skip((page - 1) * take)
                        .Take(take)
                        .ToListAsync();

        if (projects is null || projects.Count == 0) return new HttpResult()
                                    .IsOk(true)
                                    .Message("sorry, no project found")
                                    .StatusCode(404)
                                    .Get();
        return new HttpResult()
                .IsOk(true)
                .Body(projects)
                .StatusCode(200)
                .Get();
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetMyProjectsCount([FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var user) || user is null) return new HttpResult().IsOk(true).Message("no projects found for you, to create project please sing-up").StatusCode(404).Get();

        var projectsCount = await _ctx.Projects.Where((p) => p.Team.OwnerId == user.Id).CountAsync();

        int pages = (int)Math.Ceiling((double) projectsCount / take);

        return new HttpResult()
                .IsOk(true)
                .Body(pages)
                .StatusCode(200)
                .Get();
    }
}
