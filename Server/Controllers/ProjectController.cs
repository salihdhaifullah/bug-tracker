using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}")]
[ApiController]
public class ProjectController : ControllerBase
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

    [HttpGet]
    public async Task<IActionResult> GetProject(string projectId)
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var project = await _ctx.Projects
                            .Where((p) => p.Id == projectId && (!p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId)))
                            .Select((p) => new
                            {
                                name = p.Name,
                                id = p.Id,
                                isReadOnly = p.IsReadOnly,
                                createdAt = p.CreatedAt,
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

            return HttpResult.Ok(body: project);

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch, Authorized, BodyValidation]
    public async Task<IActionResult> UpdateProject(string userId, [FromBody] ChangeProjectNameDTO dto)
    {
        try
        {
            if (userId != _auth.GetId(Request)) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == dto.ProjectId).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            await _data.AddActivity(dto.ProjectId,
             $"updated the name of project from **{project.Name.Trim()}** to **{dto.Name.Trim()}**", _ctx);

            project.Name = dto.Name;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully updated project name");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }

    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProject(string projectId)
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

            return HttpResult.Ok("successfully deleted project", redirectTo: $"/users/{userId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
