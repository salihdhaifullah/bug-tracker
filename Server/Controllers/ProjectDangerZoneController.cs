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
[ApiRoute("projects/{projectId}/danger-zone")]
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

    [HttpGet, ProjectMember]
    public async Task<IActionResult> GetDangerZone([FromRoute] string projectId)
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var project = await _ctx.Projects
                            .Where(p => p.Id == projectId)
                            .Select(p => new
                            {
                                name = p.Name,
                                isPrivate = p.IsPrivate,
                                isReadOnly = p.IsReadOnly,
                                isOwner = p.Members.Any(m => m.UserId == userId && m.Role == Role.owner),
                            })
                            .FirstOrDefaultAsync();

            if (project is null) return HttpResult.NotFound("project not found", redirectTo: "/404");

            return HttpResult.Ok(body: project);

        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("visibility"), Authorized, ProjectArchive, ProjectRole(Role.owner)]
    public async Task<IActionResult> UpdateVisibility([FromRoute] string projectId)
    {
        try
        {
            var project = await _ctx.Projects
                .Where(p => p.Id == projectId)
                .FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

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
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("archive"), Authorized, ProjectRole(Role.owner)]
    public async Task<IActionResult> UpdateArchive([FromRoute] string projectId)
    {
        try
        {
            var project = await _ctx.Projects
            .Where(p => p.Id == projectId)
            .FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            await _data.AddActivity(projectId,
             $"project **{(project.IsReadOnly ? "archived" : "restored")}**", _ctx);

            project.IsReadOnly = !project.IsReadOnly;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"successfully {(project.IsReadOnly ? "archived" : "restored")} project");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("transfer"), Authorized, BodyValidation, ProjectArchive, ProjectRole(Role.owner)]
    public async Task<IActionResult> TransferProjectOwnerShip([FromBody] TransferProjectOwnerShipDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var newOwner = await _ctx.Members
                .Where(m => m.ProjectId == projectId)
                .Where(m => m.Id == dto.MemberId)
                .Include(m => m.User)
                .FirstOrDefaultAsync();

            if (newOwner == null) return HttpResult.NotFound("user not found to transfer project to");

            var currentOwner = await _ctx.Members
                .Where(m => m.ProjectId == projectId)
                .Where(m => m.UserId == userId)
                .Include(m => m.User)
                .FirstOrDefaultAsync();

            if (currentOwner == null) return HttpResult.Forbidden("you are not allowed to do this action");

            var project = await _ctx.Projects
                .Where(p => p.Id == projectId)
                .Select(p => new { p.Name })
                .FirstOrDefaultAsync();

            if (project == null) return HttpResult.NotFound("project not found");

            currentOwner.Role = Role.project_manger;

            newOwner.Role = Role.owner;

            await _data.AddActivity(dto.ProjectId,
                $"transferred project " +
                $"from [{currentOwner.User.FirstName} {currentOwner.User.LastName}](/users/{currentOwner.User.Id}) " +
                $"to [{newOwner.User.FirstName} {newOwner.User.LastName}](/users/{newOwner.User.Id})", _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully transferred project", redirectTo: $"/projects/{projectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
