using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("users/{userId}/projects/{projectId}/members/table")]
[ApiController]
public class MembersTableController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<MembersTableController> _logger;
    private readonly IDataService _data;
    private readonly IAuthService _auth;

    public MembersTableController(DataContext ctx, ILogger<MembersTableController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetMembersTableCount([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search)
    {
        try
        {
            Role? role = null;
            if (!string.IsNullOrEmpty(roleQuery) && Enum.TryParse<Role>(roleQuery, out Role parsedRole)) role = parsedRole;

            var count = await _ctx.Members
                    .Where(m => m.ProjectId == projectId
                    && (role == null || m.Role == role)
                    && (EF.Functions.ILike(m.User.Email, $"%{search}%")
                    || EF.Functions.ILike(m.User.FirstName, $"%{search}%")
                    || EF.Functions.ILike(m.User.LastName, $"%{search}%"))
                    ).CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMembersTable([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search, [FromQuery] int take = 10, [FromQuery] int page = 1)
    {
        try
        {
            Role? role = null;
            if (!string.IsNullOrEmpty(roleQuery) && Enum.TryParse<Role>(roleQuery, out Role parsedRole)) role = parsedRole;

            var members = await _ctx.Members
                        .Where(m => m.ProjectId == projectId
                        && (role == null || m.Role == role)
                        && (EF.Functions.ILike(m.User.Email, $"%{search}%")
                        || EF.Functions.ILike(m.User.FirstName, $"%{search}%")
                        || EF.Functions.ILike(m.User.LastName, $"%{search}%"))
                        ).OrderBy((m) => m.JoinedAt)
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
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
