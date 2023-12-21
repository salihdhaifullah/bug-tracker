using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Services.EmailService;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("member")]
[Consumes("application/json")]
public class MemberController : Controller
{
    private readonly DataContext _ctx;
    private readonly ILogger<MemberController> _logger;
    private readonly IDataService _data;
    private readonly IAuthService _auth;

    public MemberController(DataContext ctx, ILogger<MemberController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpPost("invite/{projectId}"), BodyValidation, Authorized]
    public async Task<IActionResult> Invite([FromBody] InviteDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isOwner = await _ctx.Members
                .AnyAsync(m => m.ProjectId == projectId
                && m.UserId == userId
                && m.Role == Role.owner);

            if (!isOwner) return HttpResult.UnAuthorized();

            var invited = await _ctx.Users
                    .Where(u => u.Id == dto.InvitedId)
                    .Select(u => new { name = $"{u.FirstName} {u.LastName}" })
                    .FirstOrDefaultAsync();

            if (invited is null) return HttpResult.BadRequest("user to invite is not exist");

            var project = await _ctx.Projects
                    .Where(p => p.Id == projectId)
                    .Select(p => new { name = p.Name, p.IsReadOnly })
                    .FirstOrDefaultAsync();

            if (project is null) return HttpResult.Forbidden(massage: "you are not authorized to invite users");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            var role = Enum.Parse<Role>(dto.Role);

            var memberId = Ulid.NewUlid().ToString();

            if (!await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == dto.InvitedId))
            {
                await _ctx.Members.AddAsync(new Member() { ProjectId = projectId, UserId = dto.InvitedId, Role = role, Id = memberId });
                await _data.AddActivity(projectId,
                            $"user [{invited.name}](/profile/{dto.InvitedId}) joined the project",
                            _ctx);
                await _ctx.SaveChangesAsync();
            }

            return HttpResult.Ok("successfully invited user");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpPatch("leave/{projectId}"), Authorized]
    public async Task<IActionResult> LeaveProject([FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var member = await _ctx.Members
            .Where(m => m.UserId == userId && m.ProjectId == projectId)
            .Include(m => m.User)
            .Include(m => m.AssignedTo)
            .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound(redirectTo: "/404");

            await _data.AddActivity(projectId,
            $"user [{member.User.FirstName} {member.User.LastName}](/profile/{userId}) left the project",
             _ctx);

            if (member.Role == Role.owner)
            {
                var project = await _ctx.Projects.Where(p => p.Id == projectId).FirstOrDefaultAsync();
                if (project is null) return HttpResult.NotFound(redirectTo: "/404");
                _ctx.Remove(project);
                await _ctx.SaveChangesAsync();
                return HttpResult.Ok(massage: "successfully deleted project", redirectTo: $"/profile/{userId}");
            }
            else
            {
                foreach (Ticket ticket in member.AssignedTo)
                {
                    ticket.AssignedToId = null;
                }

                _ctx.Remove(member);
                await _ctx.SaveChangesAsync();
                return HttpResult.Ok(massage: "successfully left project", redirectTo: $"/profile/{userId}");
            }


        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("not-members/{projectId}"), Authorized]
    public async Task<IActionResult> SearchNotMembers([FromQuery] string email, [FromRoute] string projectId)
    {
        try
        {
            var users = await _ctx.Users.Where(u =>
                    EF.Functions.ILike(u.Email, $"%{email}%")
                    && !u.MemberShips.Any(m => m.ProjectId == projectId)
                    ).OrderBy((u) => u.CreatedAt)
                    .Select(u => new
                    {
                        avatarUrl = u.AvatarUrl,
                        email = u.Email,
                        name = $"{u.FirstName} {u.LastName}",
                        id = u.Id,
                    })
                    .Take(10)
                    .ToListAsync();

            return HttpResult.Ok(body: users);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("members/{projectId}"), Authorized]
    public async Task<IActionResult> SearchMember([FromRoute] string projectId,
    [FromQuery] string email, [FromQuery(Name = "not-me")] bool notMe = false)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var members = await _ctx.Members.Where(m =>
                    (EF.Functions.ILike(m.User.Email, $"%{email}%")
                    || EF.Functions.ILike(m.User.FirstName, $"%{email}%")
                    || EF.Functions.ILike(m.User.LastName, $"%{email}%"))
                    && m.ProjectId == projectId
                    && (!notMe || m.UserId != userId)
                    ).OrderBy((u) => u.JoinedAt)
                    .Select(u => new
                    {
                        avatarUrl = u.User.AvatarUrl,
                        email = u.User.Email,
                        name = $"{u.User.FirstName} {u.User.LastName}",
                        id = u.Id,
                    })
                    .Take(10)
                    .ToListAsync();

            return HttpResult.Ok(body: members);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("chart/{projectId}"), Authorized]
    public async Task<IActionResult> MemberChart([FromRoute] string projectId)
    {
        try
        {
            var data = await _ctx.Projects
            .Where(p => p.Id == projectId)
            .Select((p) => new
            {
                developers = p.Members.Where(m => m.Role == Role.developer).Count(),
                projectMangers = p.Members.Where(m => m.Role == Role.project_manger).Count(),
            })
            .FirstOrDefaultAsync();

            return HttpResult.Ok(body: data);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpGet("members-count/{projectId}"), Authorized]
    public async Task<IActionResult> MembersCount([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search)
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

    [HttpGet("members-table/{projectId}"), Authorized]
    public async Task<IActionResult> MembersTable([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search, [FromQuery] int take = 10, [FromQuery] int page = 1)
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

    [HttpDelete("delete-member/{projectId}/{memberId}"), Authorized]
    public async Task<IActionResult> DeleteMember([FromRoute] string projectId, [FromRoute] string memberId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId && m.Role == Role.owner);

            if (!isOwner) return HttpResult.Forbidden("you are not authorized to delete a member");

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


    [HttpPatch("change-role/{projectId}"), Authorized, BodyValidation]
    public async Task<IActionResult> ChangeMemberRole([FromRoute] string projectId, [FromBody] ChangeRoleDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isOwner = await _ctx.Members.AnyAsync(m =>
            m.ProjectId == projectId
            && m.UserId == userId
            && m.Role == Role.owner);

            if (!isOwner) return HttpResult.Forbidden("you are not authorized to edit members roles in this project");

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
