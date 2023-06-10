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
    private readonly ILogger<ProjectController> _logger;

    public ProjectController(DataContext ctx, ILogger<ProjectController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpPost, Validation, Authorized]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDTO dto)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var isFoundSameName = await _ctx.Projects.AnyAsync(p => p.OwnerId == userId && p.Name == dto.Name);

            if (isFoundSameName) return HttpResult.BadRequest("project name is already exist please chose another name");

            var contentId = Ulid.NewUlid().ToString();
            var projectId = Ulid.NewUlid().ToString();
            var memberId = Ulid.NewUlid().ToString();

            var member = await _ctx.Members.AddAsync(new Member() { UserId = userId, Id = memberId, ProjectId = projectId });
            var content = await _ctx.Contents.AddAsync(new Content() { OwnerId = userId, Id = contentId });
            var project = await _ctx.Projects.AddAsync(new Project()
            {
                Name = dto.Name,
                IsPrivate = dto.IsPrivate,
                OwnerId = userId,
                Id = projectId,
                ContentId = contentId
            });

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"project {dto.Name} successfully created");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("projects/{page?}"), Authorized]
    public async Task<IActionResult> GetMyProjects([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var projects = await _ctx.Projects
                            .Where((p) => p.OwnerId == userId)
                            .OrderBy((p) => p.CreatedAt)
                            .Select((p) => new
                            {
                                createdAt = p.CreatedAt,
                                id = p.Id,
                                isPrivate = p.IsPrivate,
                                name = p.Name,
                                members = p.Members.Count,
                                tickets = p.Tickets.Count
                            })
                            .Skip((page - 1) * take)
                            .Take(take)
                            .ToListAsync();

            if (projects is null || projects.Count == 0) return HttpResult.NotFound("sorry, no project found");

            return HttpResult.Ok(null, projects);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetProject([FromRoute] string projectId)
    {
        try
        {
            var project = await _ctx.Projects
                            .Where((p) => p.Id == projectId)
                            .Select((p) => new
                            {
                                name = p.Name,
                                id = p.Id,
                                activities = p.Activities.Select(a => new
                                {
                                    createdAt = a.CreatedAt,
                                    markdown = a.Content.Markdown
                                }),
                                contentId = p.ContentId,
                                createdAt = p.CreatedAt,
                                descriptionMarkdown = p.Content != null ? p.Content.Markdown : null,
                                tickets = p.Tickets.Select(t => new
                                {
                                    createdAt = t.CreatedAt,
                                    creator = new
                                    {
                                        firstName = t.Creator.FirstName,
                                        lastName = t.Creator.LastName,
                                        imageUrl = Helper.StorageUrl(t.Creator.ImageName),
                                        id = t.Creator.Id,
                                    },
                                    assignedTo = t.AssignedTo != null ? new
                                    {
                                        firstName = t.AssignedTo.User.FirstName,
                                        lastName = t.AssignedTo.User.LastName,
                                        imageUrl = Helper.StorageUrl(t.AssignedTo.User.ImageName),
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
                                    imageUrl = Helper.StorageUrl(p.Owner.ImageName),
                                    id = p.Owner.Id,
                                },
                                members = p.Members.Select(m =>
                                new
                                {
                                    joinedAt = m.JoinedAt,
                                    firstName = m.User.FirstName,
                                    lastName = m.User.LastName,
                                    imageUrl = Helper.StorageUrl(m.User.ImageName),
                                    id = m.User.Id
                                }),
                            })
                            .FirstOrDefaultAsync();

            if (project is null) return HttpResult.NotFound("sorry, project not found");

            return HttpResult.Ok(null, project);

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpDelete("{projectId}"), Authorized]
    public async Task<IActionResult> DeleteProject([FromRoute] string projectId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var project = await _ctx.Projects.Where((p) => p.Id == projectId && p.OwnerId == userId).FirstOrDefaultAsync();

            if (project is null) return HttpResult.NotFound("sorry, project not found");

            _ctx.Projects.Remove(project);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"project \"{project.Name}\" successfully deleted");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("count"), Authorized]
    public async Task<IActionResult> GetMyProjectsCount([FromQuery] int take = 10)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var projectsCount = await _ctx.Projects.Where((p) => p.OwnerId == userId).CountAsync();

            int pages = (int)Math.Ceiling((double)projectsCount / take);

            return HttpResult.Ok(null, pages);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
