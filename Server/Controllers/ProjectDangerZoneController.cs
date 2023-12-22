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
[ApiRoute("users/{userId}/projects/{projectId}/danger-zone")]
[ApiController]
public class ProjectDangerZoneController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<ProjectDangerZoneController> _logger;

    public ProjectDangerZoneController(DataContext ctx, ILogger<ProjectDangerZoneController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpGet]
    public async Task<IActionResult> GetDangerZone([FromRoute] string projectId)
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var project = await _ctx.Projects
                            .Where((p) => p.Id == projectId && (!p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId)))
                            .Select((p) => new
                            {
                                name = p.Name,
                                isPrivate = p.IsPrivate,
                                isReadOnly = p.IsReadOnly,
                                isMember = userId != null && p.Members.Any(m => m.UserId == userId)
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

    [HttpPatch("visibility")]
    public async Task<IActionResult> UpdateVisibility(string userId, string projectId)
    {
        try
        {
            if (userId != _auth.GetId(Request)) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == projectId).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            await _data.AddActivity(projectId,
                $"project visibility changed from " +
                $"**{(project.IsPrivate ? "private" : "public")}** to " +
                $"**{(!project.IsPrivate ? "private" : "public")}**",
                _ctx);

            project.IsPrivate = !project.IsPrivate;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully updated project visibility");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("archive")]
    public async Task<IActionResult> UpdateArchive(string userId, string projectId)
    {
        try
        {
            if (userId != _auth.GetId(Request)) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == projectId).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            await _data.AddActivity(projectId,
             $"project **{(project.IsReadOnly ? "archived" : "restored")}**", _ctx);

            project.IsReadOnly = !project.IsReadOnly;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"successfully {(project.IsReadOnly ? "archived" : "restored")} project");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("transfer"), Authorized, BodyValidation]
    public async Task<IActionResult> TransferProjectOwnerShip([FromBody] TransferProjectOwnerShipDTO dto)
    {
        try
        {
            var newOwner = await _ctx.Members
                .Where(m => m.ProjectId == dto.ProjectId && m.Role != Role.owner && m.Id == dto.MemberId)
                .Include(m => m.User)
                .FirstOrDefaultAsync();

            if (newOwner == null) return HttpResult.NotFound("user not found to transfer project to");

            var userId = _auth.GetId(Request);

            var currentOwner = await _ctx.Members
                .Where(m => m.ProjectId == dto.ProjectId && m.UserId == userId && m.Role == Role.owner)
                .Include(m => m.User)
                .FirstOrDefaultAsync();

            if (currentOwner == null) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects.Where(p => p.Id == dto.ProjectId).Select(p => new { p.Name, p.IsReadOnly }).FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            currentOwner.Role = Role.project_manger;

            newOwner.Role = Role.owner;

            await _data.AddActivity(dto.ProjectId,
                $"transferred project " +
                $"from [{currentOwner.User.FirstName} {currentOwner.User.LastName}](/users/{currentOwner.User.Id}) " +
                $"to [{newOwner.User.FirstName} {newOwner.User.LastName}](/users/{newOwner.User.Id})", _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully transferred project");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
