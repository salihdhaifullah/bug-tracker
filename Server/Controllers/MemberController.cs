using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/members/{memberId}")]
[ApiController]
public class MembersController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<MembersController> _logger;
    private readonly IDataService _data;

    public MembersController(DataContext ctx, ILogger<MembersController> logger, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
    }

    [HttpDelete, Authorized, ProjectArchive, ProjectRole(Role.owner)]
    public async Task<IActionResult> DeleteMember([FromRoute] string projectId, [FromRoute] string memberId)
    {
        try
        {
            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.UserId == memberId)
                    .Include(m => m.User)
                    .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound("the member to delete is not found");

            await _data.AddActivity(projectId,
                $"member [{member.User.FirstName} {member.User.LastName}](/users/{member.UserId})" +
                $"deleted from the project",
                _ctx);

            _ctx.Members.Remove(member);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted member");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }



    [HttpPatch, Authorized, BodyValidation, ProjectArchive, ProjectRole(Role.owner)]
    public async Task<IActionResult> UpdateMember([FromRoute] string projectId, [FromBody] ChangeRoleDTO dto)
    {
        try
        {
            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.UserId == dto.MemberId)
                    .Include(m => m.User)
                    .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound("the member is not found");

            var newRole = Enum.Parse<Role>(dto.Role);

            await _data.AddActivity(projectId,
            $"member [{member.User.FirstName} {member.User.LastName}](/users/{member.UserId}) " +
            $"role changed from **{member.Role.ToString()}** to **{newRole.ToString()}**",
            _ctx);

            member.Role = newRole;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully changed role");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
