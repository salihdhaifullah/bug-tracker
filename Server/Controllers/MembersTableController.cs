using Buegee.Data;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("projects/{projectId}/members/table")]
[ApiController]
public class MembersTableController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<MembersTableController> _logger;

    public MembersTableController(DataContext ctx, ILogger<MembersTableController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpGet("count"), ProjectRead]
    public async Task<IActionResult> GetMembersTableCount([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search)
    {
        try
        {
            var role = Helper.ParseEnum<Role>(roleQuery);

            var count = await _ctx.Members
                    .Where(m => m.ProjectId == projectId)
                    .Where(m => role == null || m.Role == role)
                    .Where(m =>
                        EF.Functions.ILike(m.User.Email, $"%{search}%")
                        || EF.Functions.ILike(m.User.FirstName, $"%{search}%")
                        || EF.Functions.ILike(m.User.LastName, $"%{search}%"))
                    .CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet, ProjectRead]
    public async Task<IActionResult> GetMembersTable([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search, [FromQuery] int take = 10, [FromQuery] int page = 1)
    {
        try
        {
            var role = Helper.ParseEnum<Role>(roleQuery);

            var members = await _ctx.Members
                        .Where(m => m.ProjectId == projectId)
                        .Where(m => role == null || m.Role == role)
                        .Where(m =>
                        EF.Functions.ILike(m.User.Email, $"%{search}%")
                        || EF.Functions.ILike(m.User.FirstName, $"%{search}%")
                        || EF.Functions.ILike(m.User.LastName, $"%{search}%"))
                        .OrderBy((m) => m.JoinedAt)
                        .Select(m => new
                        {
                            avatarUrl = m.User.AvatarUrl,
                            email = m.User.Email,
                            name = $"{m.User.FirstName} {m.User.LastName}",
                            role = m.Role.ToString(),
                            joinedAt = m.JoinedAt,
                            id = m.User.Id,
                        })
                        .Skip((page - 1) * take)
                        .Take(take)
                        .ToListAsync();

            return HttpResult.Ok(body: members);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
