using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("users/{userId}/projects/{projectId}/members/{memberId}")]
[ApiController]
public class MembersController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<MembersController> _logger;
    private readonly IDataService _data;
    private readonly IAuthService _auth;

    public MembersController(DataContext ctx, ILogger<MembersController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpDelete, Authorized]
    public async Task<IActionResult> DeleteMember([FromRoute] string projectId, [FromRoute] string userId, [FromRoute] string memberId)
    {
        try
        {
            if (userId != _auth.GetId(Request)) return HttpResult.Forbidden("you are not authorized to delete a member");

            var isReadOnly = await _ctx.Projects.AnyAsync(p => p.Id == projectId && p.IsReadOnly);

            if (isReadOnly) return HttpResult.BadRequest("this project is archived");

            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.UserId == memberId)
                    .Include(m => m.User)
                    .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound("the member to delete is not found");

            await _data.AddActivity(projectId,
                $"member [{member.User.FirstName} {member.User.LastName}](/profile/{member.UserId})" +
                $"deleted from the project",
                _ctx);

            _ctx.Members.Remove(member);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted member");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }



    [HttpPatch, Authorized, BodyValidation]
    public async Task<IActionResult> UpdateMember([FromRoute] string projectId, [FromRoute] string userId, [FromBody] ChangeRoleDTO dto)
    {
        try
        {
           if (userId != _auth.GetId(Request)) return HttpResult.Forbidden("you are not authorized to edit members roles in this project");

            var isReadOnly = await _ctx.Projects.AnyAsync(p => p.Id == projectId && p.IsReadOnly);

            if (isReadOnly) return HttpResult.BadRequest("this project is archived");

            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.UserId == dto.MemberId)
                    .Include(m => m.User)
                    .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound("the member is not found");

            var newRole = Enum.Parse<Role>(dto.Role);

            await _data.AddActivity(projectId,
            $"member [{member.User.FirstName} {member.User.LastName}](/profile/{member.UserId}) " +
            $"role changed from **{member.Role.ToString()}** to **{newRole.ToString()}**",
            _ctx);

            member.Role = newRole;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully changed role");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
