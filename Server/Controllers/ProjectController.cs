using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiRoute("project")]
[Consumes("application/json")]
public class ProjectController : Controller
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<ProjectController> _logger;

    public ProjectController(DataContext ctx, ILogger<ProjectController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpPost, BodyValidation, Authorized]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var contentId = Ulid.NewUlid().ToString();
            var projectId = Ulid.NewUlid().ToString();
            var memberId = Ulid.NewUlid().ToString();

            await _ctx.Members.AddAsync(new Member() { UserId = userId, Id = memberId, ProjectId = projectId, Role = Role.owner, IsJoined = true });
            await _ctx.Contents.AddAsync(new Content() { Id = contentId });
            await _ctx.Projects.AddAsync(new Project()
            {
                Name = dto.Name,
                IsPrivate = dto.IsPrivate,
                Id = projectId,
                ContentId = contentId
            });

            await _data.CreateProjectActivity(projectId, dto.Name, _ctx);

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
            var userId = _auth.GetId(Request);

            var projects = await _ctx.Projects
                            .Where((p) => p.Members.Any(m => m.UserId == userId))
                            .OrderBy((p) => p.CreatedAt)
                            .Select((p) => new
                            {
                                createdAt = p.CreatedAt,
                                id = p.Id,
                                isPrivate = p.IsPrivate,
                                name = p.Name,
                                role = p.Members.Where(m => m.UserId == userId).Select(m => m.Role.ToString()), 
                                members = p.Members.Where(m => m.IsJoined).Count(),
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
            _auth.TryGetId(Request, out string? userId);

            var project = await _ctx.Projects
                            .Where((p) => p.Id == projectId && (!p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId && m.IsJoined)))
                            .Select((p) => new
                            {
                                name = p.Name,
                                id = p.Id,
                                isPrivate = p.IsPrivate,
                                isReadOnly = p.IsReadOnly,
                                members = p.Members.Count,
                                tickets = p.Tickets.Count,
                                createdAt = p.CreatedAt,
                                markdown = p.Content.Markdown,
                                owner = p.Members.Where(m => m.Role == Role.owner).Select(m => new
                                {
                                    name = $"{m.User.FirstName} {m.User.LastName}",
                                    avatarUrl = m.User.AvatarUrl,
                                    id = m.UserId,
                                })
                                .FirstOrDefault(),
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
            var userId = _auth.GetId(Request);

            var project = await _ctx.Projects
            .Where((p) => p.Id == projectId && p.Members.Any(m => m.UserId == userId && m.Role == Role.owner))
            .FirstOrDefaultAsync();

            if (project is null) return HttpResult.NotFound("sorry, project not found");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

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
            var userId = _auth.GetId(Request);

            var projectsCount = await _ctx.Projects.Where((p) => p.Members.Any(m => m.UserId == userId)).CountAsync();

            int pages = (int)Math.Ceiling((double)projectsCount / take);

            return HttpResult.Ok(null, pages);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("content/{projectId}"), Authorized, BodyValidation]
    public async Task<IActionResult> Profile([FromBody] ContentDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isAllowed = await _ctx.Projects
                    .AnyAsync(p => p.Id == projectId && p.Members.Any(m => m.UserId == userId
                    && (m.Role == Role.owner || m.Role == Role.project_manger)));

            if (!isAllowed) return HttpResult.Forbidden("you are not allowed to do this action");

            var isArchived = await _ctx.Projects.AnyAsync(p => p.Id == projectId && p.IsReadOnly);

            if (isArchived) return HttpResult.BadRequest("this project is archived");

            var content = await _ctx.Projects
                          .Where(p => p.Id == projectId)
                          .Include(p => p.Content)
                          .ThenInclude(c => c.Documents)
                          .Select(p => p.Content)
                          .FirstOrDefaultAsync();

            if (content is null) return HttpResult.UnAuthorized();

            await _data.EditContent(dto, content, _ctx);

            return HttpResult.Ok("successfully changed content");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("visibility/{projectId}"), Authorized]
    public async Task<IActionResult> Visibility([FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId && m.Role == Role.owner && m.IsJoined);

            if (!isOwner) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == projectId).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            await _data.ChangeVisibilityActivity(projectId, project.Name, project.IsPrivate, _ctx);

            project.IsPrivate = !project.IsPrivate;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"successfully changed project visibility to {(project.IsPrivate ? "private" : "public")}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("archive/{projectId}"), Authorized]
    public async Task<IActionResult> Archive([FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId && m.Role == Role.owner && m.IsJoined);

            if (!isOwner) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == projectId).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            await _data.ArchiveProjectActivity(projectId, project.Name, project.IsReadOnly, _ctx);

            project.IsReadOnly = !project.IsReadOnly;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"successfully {(project.IsReadOnly ? "archived" : "unarchive")} project");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpPost("transfer"), Authorized, BodyValidation]
    public async Task<IActionResult> TransferProjectOwnerShip([FromBody] TransferProjectOwnerShipDTO dto)
    {
        try
        {
            var newOwner = await _ctx.Members
                .Where(m => m.IsJoined && m.ProjectId == dto.ProjectId && m.Role != Role.owner && m.Id == dto.MemberId)
                .Include(m => m.User)
                .FirstOrDefaultAsync();

            if (newOwner == null) return HttpResult.NotFound("user not found to transfer project to");

            var userId = _auth.GetId(Request);

            var currentOwner = await _ctx.Members
                .Where(m => m.ProjectId == dto.ProjectId && m.UserId == userId && m.Role == Role.owner && m.IsJoined)
                .Include(m => m.User)
                .FirstOrDefaultAsync();

            if (currentOwner == null) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == dto.ProjectId).Select(p => new { p.Name, p.IsReadOnly }).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            currentOwner.Role = Role.project_manger;

            newOwner.Role = Role.owner;

            await _data.TransferOwnershipActivity(dto.ProjectId, project.Name, $"{currentOwner.User.FirstName} {currentOwner.User.LastName}", $"{newOwner.User.FirstName} {newOwner.User.LastName}", _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"successfully transferred project");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("content/{projectId}")]
    public async Task<IActionResult> GetProjectContent([FromRoute] string projectId)
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var content = await _ctx.Projects
                        .Where(p => p.Id == projectId && (!p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId && m.IsJoined)))
                        .Select(p => new { markdown = p.Content.Markdown })
                        .FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

            return HttpResult.Ok(body: content);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("is-owner/{projectId}")]
    public async Task<IActionResult> IsOwner([FromRoute] string projectId)
    {
        try
        {
            var isOwner = false;

            if (_auth.TryGetId(Request, out string? userId))
            {
                isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId && m.Role == Role.owner);
            }

            return HttpResult.Ok(body: isOwner);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("role/{projectId}")]
    public async Task<IActionResult> GetRole([FromRoute] string projectId)
    {
        try
        {
            var role = "";

            if (_auth.TryGetId(Request, out string? userId))
            {
                role = await _ctx.Members.Where(m => m.ProjectId == projectId && m.UserId == userId).Select(m => m.Role.ToString()).FirstOrDefaultAsync();
            }

            return HttpResult.Ok(body: role);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("is-owner-or-manger/{projectId}")]
    public async Task<IActionResult> IsOwnerOrManger([FromRoute] string projectId)
    {
        try
        {
            var isOwnerOrManger = false;

            if (_auth.TryGetId(Request, out string? userId))
            {
                isOwnerOrManger = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId && (m.Role == Role.owner || m.Role == Role.project_manger));
            }

            return HttpResult.Ok(body: isOwnerOrManger);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
