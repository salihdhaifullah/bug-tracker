using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
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


        var isFound = await _ctx.Projects.AnyAsync((p) => p.Name == dto.Name && p.OwnerId == userId);

        if (isFound) BadRequestResult($"there a project name with the same name as {dto.Name}, please chose another name");

        var data = _ctx.Projects.Add(new Project()
        {
            Name = dto.Name,
            IsPrivate = dto.IsPrivate,
            OwnerId = userId,
        });

        await _ctx.SaveChangesAsync();

        return OkResult($"project {dto.Name} successfully created", new { data.Entity.Members, data.Entity.Owner, data.Entity.CreatedAt, data.Entity.IsPrivate, data.Entity.Name, data.Entity.Id });
    }

    [HttpGet("projects/{page?}")]
    public async Task<IActionResult> GetMyProjects([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return NotFoundResult("no projects found for you, to create project please sing-up");

        var projects = await _ctx.Projects
                        .Where((p) => p.OwnerId == userId)
                        .OrderBy((p) => p.CreatedAt)
                        .Select((p) => new
                        {
                            members = p.Members.Count + 1,
                            tickets = p.Tickets.Count,
                            createdAt = p.CreatedAt,
                            id = p.Id,
                            isPrivate = p.IsPrivate,
                            name = p.Name
                        })
                        .Skip((page - 1) * take)
                        .Take(take)
                        .ToListAsync();

        if (projects is null || projects.Count == 0) return NotFoundResult("sorry, no project found");

        return OkResult(null, projects);
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> xdvsv([FromRoute] int projectId)
    {
        if (!_auth.TryGetUser(HttpContext, out var user) || user is null) return NotFoundResult("no projects found for you, to create project please sing-up");

        var project = await _ctx.Projects
                        .Where((p) => p.Id == projectId)
                        .Select((p) => new
                        {
                            activities = p.Activities,
                            createdAt = p.CreatedAt,
                            description = p.Description,
                            ownerId = p.OwnerId,
                            members = p.Members.Count,
                        })
                        .FirstOrDefaultAsync();

        if (project is null) return NotFoundResult("sorry, project not found");

        return OkResult(null, project);

    }

    [HttpGet("count")]
    public async Task<IActionResult> GetMyProjectsCount([FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return NotFoundResult("no projects found for you, to create project please sing-up");

        var projectsCount = await _ctx.Projects.Where((p) => p.OwnerId == userId).CountAsync();

        int pages = (int)Math.Ceiling((double)projectsCount / take);


        return OkResult(null, pages);

    }
}
