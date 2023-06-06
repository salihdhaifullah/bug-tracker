using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiRoute("project")]
[Consumes("application/json")]
public class ProjectController : Controller
{
    private readonly DataContext _ctx;

    public ProjectController(DataContext ctx)
    {
        _ctx = ctx;
    }

    [HttpPost, Validation, Authorized]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDTO dto)
    {
        var userId = (int)(HttpContext.Items["userId"])!;

        var project = await _ctx.Projects.AddAsync(new Project()
        {
            Name = dto.Name,
            IsPrivate = dto.IsPrivate,
            OwnerId = userId
        });

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok($"project {dto.Name} successfully created");
    }

    [HttpGet("projects/{page?}"), Authorized]
    public async Task<IActionResult> GetMyProjects([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        var userId = (int)(HttpContext.Items["userId"])!;

        var projects = await _ctx.Projects
                        .Where((p) => p.OwnerId == userId)
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

        if (projects is null || projects.Count == 0) return HttpResult.NotFound("sorry, no project found");

        return HttpResult.Ok(null, projects);
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetProject([FromRoute] int projectId)
    {
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
                            descriptionMarkdown = p.Content != null ? p.Content.Markdown : null,
                            tickets = p.Tickets.Select(t => new
                            {
                                createdAt = t.CreatedAt,
                                creator = new
                                {
                                    firstName = t.Creator.FirstName,
                                    lastName = t.Creator.LastName,
                                    imageUrl = t.Creator.Image.Url,
                                    id = t.Creator.Id,
                                },
                                assignedTo = t.AssignedTo != null ? new
                                {
                                    firstName = t.AssignedTo.User.FirstName,
                                    lastName = t.AssignedTo.User.LastName,
                                    imageUrl = t.AssignedTo.User.Image.Url,
                                    id = t.AssignedTo.User.Id,
                                } : null,
                                name = t.Name,
                                priority = t.Priority.ToString(),
                                status = t.Status.ToString(),
                                type = t.Type.ToString(),
                            }),
                            owner = new
                            {
                                firstName = p.Owner.FirstName,
                                lastName = p.Owner.LastName,
                                imageUrl = p.Owner.Image.Url,
                                id = p.Owner.Id,
                            },
                            members = p.Members.Select(m =>
                            new
                            {
                                joinedAt = m.JoinedAt,
                                firstName = m.User.FirstName,
                                lastName = m.User.LastName,
                                imageUrl = m.User.Image.Url,
                                id = m.User.Id
                            }),
                        })
                        .AsSplitQuery()
                        .FirstOrDefaultAsync();

        if (project is null) return HttpResult.NotFound("sorry, project not found");

        return HttpResult.Ok(null, project);
    }

    [HttpDelete("{projectId}"), Authorized]
    public async Task<IActionResult> DeleteProject([FromRoute] int projectId)
    {
        var userId = (int)(HttpContext.Items["userId"])!;

        var project = await _ctx.Projects.Where((p) => p.Id == projectId && p.OwnerId == userId).FirstOrDefaultAsync();

        if (project is null) return HttpResult.NotFound("sorry, project not found");

        _ctx.Projects.Remove(project);

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok($"project \"{project.Name}\" successfully deleted");
    }

    [HttpGet("count"), Authorized]
    public async Task<IActionResult> GetMyProjectsCount([FromQuery] int take = 10)
    {
        var userId = (int)(HttpContext.Items["userId"])!;

        var projectsCount = await _ctx.Projects.Where((p) => p.OwnerId == userId).CountAsync();

        int pages = (int)Math.Ceiling((double)projectsCount / take);

        return HttpResult.Ok(null, pages);

    }
}
