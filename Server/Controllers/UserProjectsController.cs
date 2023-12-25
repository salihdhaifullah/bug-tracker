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

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects")]
[ApiController]
public class UserProjectsController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<UserProjectsController> _logger;

    public UserProjectsController(DataContext ctx, ILogger<UserProjectsController> logger, IDataService data, IAuthService auth)
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

            await _ctx.Members.AddAsync(new Member() { UserId = userId, Id = memberId, ProjectId = projectId, Role = Role.owner });
            await _ctx.Contents.AddAsync(new Content() { Id = contentId });
            await _ctx.Projects.AddAsync(new Project()
            {
                Name = dto.Name,
                IsPrivate = dto.IsPrivate,
                Id = projectId,
                ContentId = contentId
            });

            await _data.AddActivity(projectId, $"created project **{dto.Name.Trim()}**", _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully created project", redirectTo: $"/users/{userId}/projects/{projectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetUserProjects(
        [FromRoute] string userId, [FromQuery(Name = "type")] string? type,
        [FromQuery(Name = "role")] string? roleQuery,
        [FromQuery] string? search, [FromQuery(Name = "status")] string? status,
        [FromQuery] int take = 10,
        [FromQuery] int page = 1)
    {
        try
        {
            _auth.TryGetId(Request, out string? currentUserId);

            var role = Helper.ParseEnum<Role>(roleQuery);

            bool? isPrivate = null;
            if (!string.IsNullOrEmpty(type) && type == "private") isPrivate = true;
            else if (!string.IsNullOrEmpty(type) && type == "public") isPrivate = false;

            bool? isReadOnly = null;
            if (!string.IsNullOrEmpty(status) && status == "archived") isReadOnly = true;
            else if (!string.IsNullOrEmpty(status) && status == "unarchive") isReadOnly = false;

            var projects = await _ctx.Projects
                            .Where((p) => (!p.IsPrivate || (currentUserId != null && p.Members.Any(m => m.UserId == currentUserId)))
                            && p.Members.Any(m => m.UserId == userId && (role == null || m.Role == role))
                            && (isPrivate == null || p.IsPrivate == isPrivate)
                            && (isReadOnly == null || p.IsReadOnly == isReadOnly)
                            && EF.Functions.ILike(p.Name, $"%{search}%")
                            ).OrderByDescending((p) => p.Activities.Max(a => a.CreatedAt))
                            .Select((p) => new
                            {
                                createdAt = p.CreatedAt,
                                id = p.Id,
                                isPrivate = p.IsPrivate,
                                isReadOnly = p.IsReadOnly,
                                name = p.Name,
                                role = p.Members.Where(m => m.UserId == userId).Select(m => m.Role.ToString()),
                                members = p.Members.Count,
                                tickets = p.Tickets.Count
                            })
                            .Skip((page - 1) * take)
                            .Take(take)
                            .ToListAsync();

            return HttpResult.Ok(body: projects);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetUserProjectsCount(
        [FromRoute] string userId, [FromQuery(Name = "type")] string? type,
        [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search,
        [FromQuery(Name = "status")] string? status, [FromQuery] int take = 10)
    {
        try
        {
            _auth.TryGetId(Request, out string? currentUserId);

            var role = Helper.ParseEnum<Role>(roleQuery);

            bool? isPrivate = null;
            if (!string.IsNullOrEmpty(type) && type == "private") isPrivate = true;
            else if (!string.IsNullOrEmpty(type) && type == "public") isPrivate = false;

            bool? isReadOnly = null;
            if (!string.IsNullOrEmpty(status) && status == "archived") isReadOnly = true;
            else if (!string.IsNullOrEmpty(status) && status == "unarchive") isReadOnly = false;

            var count = await _ctx.Projects.Where((p) =>
                            (!p.IsPrivate || (currentUserId != null && p.Members.Any(m => m.UserId == currentUserId)))
                            && p.Members.Any(m => m.UserId == userId && (role == null || m.Role == role))
                            && (isPrivate == null || p.IsPrivate == isPrivate)
                            && (isReadOnly == null || p.IsReadOnly == isReadOnly)
                            && EF.Functions.ILike(p.Name, $"%{search}%")
                            )
                            .CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
