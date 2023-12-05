using System.Text.Json;
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
    private readonly IEmailService _email;
    private readonly IJWTService _jwt;
    private readonly ILogger<MemberController> _logger;
    private readonly IRedisCacheService _cache;
    private readonly IDataService _data;
    private readonly IAuthService _auth;

    public MemberController(DataContext ctx, ILogger<MemberController> logger, IEmailService email, IJWTService jwt, IDataService data, IRedisCacheService cache, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _email = email;
        _jwt = jwt;
        _cache = cache;
        _data = data;
        _auth = auth;
    }

    private record Invention(string projectId, string userId, string userFullName);

    [HttpPost("invent/{projectId}"), BodyValidation, Authorized]
    public async Task<IActionResult> Invent([FromBody] InventDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var user = await _ctx.Users
                    .Where(u => u.Id == dto.InventedId)
                    .Select(u => new { name = $"{u.FirstName} {u.LastName}", email = u.Email })
                    .FirstOrDefaultAsync();

            if (user is null) return HttpResult.BadRequest("user to invent is not exist");

            var invited = await _ctx.Users.Where(u => u.Id == userId)
                            .Select(u => new { name = $"{u.FirstName} {u.LastName}" })
                            .FirstOrDefaultAsync();

            if (invited is null) return HttpResult.UnAuthorized();

            var project = await _ctx.Projects
                    .Where(p => p.Id == projectId && p.Members.Any(m => m.User.Id == userId && m.Role == Role.owner))
                    .Select(p => new { name = p.Name, p.IsReadOnly })
                    .FirstOrDefaultAsync();


            if (project is null) return HttpResult.Forbidden(massage: "you are not authorized to invent users");

            if (project.IsReadOnly) return HttpResult.BadRequest("this project is archived");

            var role = Enum.Parse<Role>(dto.Role);

            var memberId = Ulid.NewUlid().ToString();

            if (!await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == dto.InventedId))
            {
                await _ctx.Members.AddAsync(new Member() { ProjectId = projectId, UserId = dto.InventedId, Role = role, Id = memberId });
                await _ctx.SaveChangesAsync();
            }

            var age = new TimeSpan(7, 0, 0, 0);

            var sessionId = Guid.NewGuid().ToString();

            await _cache.Redis.StringSetAsync(sessionId, JsonSerializer.Serialize<Invention>(new Invention(projectId, dto.InventedId, user.name)), age);

            _email.Invitation(user.email, user.name, project.name, role, invited.name, $"{Helper.BaseUrl(Request)}/join-project/{sessionId}");

            return HttpResult.Ok("successfully invented user");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("{sessionId}"), Authorized]
    public async Task<IActionResult> JoinProject([FromRoute] string sessionId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            string? json = await _cache.Redis.StringGetAsync(sessionId);

            if (String.IsNullOrEmpty(json)) return HttpResult.NotFound(redirectTo: "/404");

            var data = JsonSerializer.Deserialize<Invention>(json);

            if (data is null || data.userId != userId) return HttpResult.NotFound(redirectTo: "/404");

            var member = await _ctx.Members.Where(m => m.UserId == data.userId && m.ProjectId == data.projectId).FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound(redirectTo: "/404");

            member.IsJoined = true;
            member.JoinedAt = DateTime.UtcNow;

            await _data.AddActivity(data.projectId,
            $"user [{data.userFullName}](/profile/{data.userId}) joined the project",
             _ctx);

            await _ctx.SaveChangesAsync();

            await _cache.Redis.KeyDeleteAsync(sessionId);

            return HttpResult.Ok(massage: "successfully joined project", redirectTo: $"/project/{data.projectId}");
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
            var users = await _ctx.Users.Where(u => (EF.Functions.ILike(u.Email, $"%{email}%")) && !u.MemberShips.Any(m => m.ProjectId == projectId && m.IsJoined))
                            .OrderBy((u) => u.CreatedAt)
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
    public async Task<IActionResult> SearchMember([FromRoute] string projectId, [FromQuery] string email, [FromQuery(Name = "not-me")] bool notMe = false)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var nameParts = string.IsNullOrEmpty(email) ? null : email.Split(" ");
            var members = await _ctx.Members.Where(m => ((!(nameParts == null || nameParts.Length < 2) && (m.User.FirstName == nameParts[0] && m.User.LastName == nameParts[1])) || EF.Functions.ILike(m.User.Email, $"%{email}%") || EF.Functions.ILike(m.User.FirstName, $"%{email}%") || EF.Functions.ILike(m.User.LastName, $"%{email}%")) && m.ProjectId == projectId && m.IsJoined && (!notMe || m.UserId != userId))
                    .OrderBy((u) => u.JoinedAt)
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


    [HttpGet("members-count/{projectId}"), Authorized]
    public async Task<IActionResult> MembersCount([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search)
    {
        try
        {
            Role? role = null;
            if (!string.IsNullOrEmpty(roleQuery) && Enum.TryParse<Role>(roleQuery, out Role parsedRole)) role = parsedRole;

            var count = await _ctx.Members.Where(m => m.ProjectId == projectId && m.IsJoined && (role == null || m.Role == role) && (EF.Functions.ILike(m.User.Email, $"%{search}%") || EF.Functions.ILike(m.User.FirstName, $"%{search}%") || EF.Functions.ILike(m.User.LastName, $"%{search}%"))).CountAsync();

            return HttpResult.Ok(body: count);
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
                        .Where(m => m.ProjectId == projectId && m.IsJoined && (role == null || m.Role == role) &&
                        (EF.Functions.ILike(m.User.Email, $"%{search}%") || EF.Functions.ILike(m.User.FirstName, $"%{search}%") || EF.Functions.ILike(m.User.LastName, $"%{search}%")))
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

            var isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.IsJoined && m.UserId == userId && m.Role == Role.owner);

            if (!isOwner) return HttpResult.Forbidden("you are not authorized to delete a member");

            var isReadOnly = await _ctx.Projects.AnyAsync(p => p.Id == projectId && p.IsReadOnly);

            if (isReadOnly) return HttpResult.BadRequest("this project is archived");

            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.IsJoined && m.UserId == memberId)
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

            var isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.IsJoined && m.UserId == userId && m.Role == Role.owner);

            if (!isOwner) return HttpResult.Forbidden("you are not authorized to edit members roles in this project");

            var isReadOnly = await _ctx.Projects.AnyAsync(p => p.Id == projectId && p.IsReadOnly);

            if (isReadOnly) return HttpResult.BadRequest("this project is archived");

            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.IsJoined && m.UserId == dto.MemberId)
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
