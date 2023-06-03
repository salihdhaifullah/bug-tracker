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


        var project = await _ctx.Projects.AddAsync(new Project()
        {
            Name = dto.Name,
            IsPrivate = dto.IsPrivate
        });

        var description =  await _ctx.Contents.AddAsync(new Content() { Markdown = "" });

        var ProjectDetails = await _ctx.ProjectsDetails.AddAsync(new ProjectDetails()
        {
            ProjectId = project.Entity.Id,
            DescriptionId = description.Entity.Id,
            OwnerId = userId
        });

        await _ctx.SaveChangesAsync();

        return OkResult($"project {dto.Name} successfully created");
    }

    [HttpGet("projects/{page?}")]
    public async Task<IActionResult> GetMyProjects([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return NotFoundResult("no projects found for you, to create project please sing-up");

        var projects = await _ctx.ProjectsDetails
                        .Where((p) => p.OwnerId == userId)
                        .OrderBy((p) => p.Project.CreatedAt)
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
    public async Task<IActionResult> GetProject([FromRoute] int projectId)
    {
        if (!_auth.TryGetUser(HttpContext, out var user) || user is null) return NotFoundResult("no projects found for you, to create project please sing-up");

        var project = await _ctx.Projects
                        .Where((p) => p.Id == projectId)
                        .Select((p) => new
                        {
                            name = p.Name,
                            activities = p.Activities.Select(a => new
                            {
                                createdAt = a.CreatedAt,
                                markdown = a.Content.Markdown
                            }),
                            createdAt = p.CreatedAt,
                            descriptionMarkdown = p.Description != null ? p.Description.Markdown : "",
                            id = p.Id,
                            tickets = p.Tickets.Select(t => new
                            {
                                createdAt = t.CreatedAt,
                                creator = new
                                {
                                    firstName = t.Creator.FirstName,
                                    lastName = t.Creator.LastName,
                                    imageId = t.Creator.ImageId,
                                    id = t.Creator.Id,
                                },
                                assignedTo = t.AssignedTo != null ? new
                                {
                                    firstName = t.AssignedTo.User.FirstName,
                                    lastName = t.AssignedTo.User.LastName,
                                    imageId = t.AssignedTo.User.ImageId,
                                    id = t.AssignedTo.User.Id,
                                } : null,
                                title = t.Title,
                                priority = t.Priority.ToString(),
                                status = t.Status.ToString(),
                                type = t.Type.ToString(),
                            }),
                            owner = new
                            {
                                firstName = p.Owner.FirstName,
                                lastName = p.Owner.LastName,
                                imageId = p.Owner.ImageId,
                                id = p.Owner.Id,
                            },
                            members = p.Members.Select(m =>
                            new
                            {
                                joinedAt = m.CreatedAt,
                                firstName = m.User.FirstName,
                                lastName = m.User.LastName,
                                imageId = m.User.ImageId,
                                id = m.User.Id
                            }),
                        })
                        .AsSplitQuery()
                        .FirstOrDefaultAsync();

        if (project is null) return NotFoundResult("sorry, project not found");

        return OkResult(null, project);
    }

    [HttpDelete("{projectId}")]
    public async Task<IActionResult> DeleteProject([FromRoute] int projectId)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return NotFoundResult("please sing-up to continue");

        var project = await _ctx.Projects.Where((p) => p.Id == projectId && p.OwnerId == userId).FirstOrDefaultAsync();

        if (project is null) return NotFoundResult("sorry, project not found");

        _ctx.Projects.Remove(project);

        await _ctx.SaveChangesAsync();

        return OkResult($"project \"{project.Name}\" successfully deleted");
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
