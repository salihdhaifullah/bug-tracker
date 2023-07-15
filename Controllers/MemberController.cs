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

            var inventer = await _ctx.Users.Where(u => u.Id == userId)
                            .Select(u => new { name = $"{u.FirstName} {u.LastName}" })
                            .FirstOrDefaultAsync();

            if (inventer is null) return HttpResult.UnAuthorized();

            var project = await _ctx.Projects
                    .Where(p => p.Id == projectId && p.Members.Any(m => m.User.Id == userId && m.Role == Role.owner))
                    .Select(p => new { name = p.Name })
                    .FirstOrDefaultAsync();

            if (project is null) return HttpResult.Forbidden(massage: "you are not authorized to invent users", redirectTo: "/403");

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

            _email.Invitation(user.email, user.name, project.name, role, inventer.name, $"{Helper.BaseUrl(Request)}/join-project/{sessionId}");

            return HttpResult.Ok($"successfully invented user {user.name}");
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

            await _data.JoinProjectActivity(data.projectId, data.userFullName, _ctx);

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

    [HttpGet("not-members/{projectId}"), Authorized]
    public async Task<IActionResult> SearchNotMembers([FromQuery] string email, [FromRoute] string projectId)
    {
        try
        {
            var users = await _ctx.Users.Where(u => (EF.Functions.ILike(u.Email, $"{email}%")) && !u.MemberShips.Any(m => m.ProjectId == projectId && m.IsJoined))
                            .OrderBy((u) => u.CreatedAt)
                            .Select(u => new
                            {
                                imageUrl = Helper.StorageUrl(u.ImageName),
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
    public async Task<IActionResult> SearchMember([FromQuery] string email, [FromRoute] string projectId)
    {
        try
        {
            var emailParts = string.IsNullOrEmpty(email) ? null : email.Split(" ");
            var members = await _ctx.Members.Where(m =>  ((!(emailParts == null || emailParts.Length < 2) && (m.User.FirstName == emailParts[0] && m.User.LastName == emailParts[1])) || EF.Functions.ILike(m.User.Email, $"{email}%") || EF.Functions.ILike(m.User.FirstName, $"{email}%") || EF.Functions.ILike(m.User.LastName, $"{email}%")) && m.ProjectId == projectId && m.IsJoined)
                    .OrderBy((u) => u.JoinedAt)
                    .Select(u => new
                    {
                        imageUrl = Helper.StorageUrl(u.User.ImageName),
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

    // TODO pagination
    [HttpGet("members-table/{projectId}"), Authorized]
    public async Task<IActionResult> MembersTable([FromRoute] string projectId, [FromQuery(Name = "role")] string? roleQuery, [FromQuery] string? search, [FromQuery] int take = 10, [FromQuery] int page = 1)
    {
        try
        {
            Role? role = null;
            if (!string.IsNullOrEmpty(roleQuery) && Enum.TryParse<Role>(roleQuery, out Role parsedRole)) role = parsedRole;

            var count = await _ctx.Members.Where(m => m.ProjectId == projectId && m.IsJoined && (role == null || m.Role == role) && (EF.Functions.ILike(m.User.Email, $"{search}%") || EF.Functions.ILike(m.User.FirstName, $"{search}%") || EF.Functions.ILike(m.User.LastName, $"{search}%"))).CountAsync();

            var members = await _ctx.Members
                        .Where(m => m.ProjectId == projectId && m.IsJoined && (role == null || m.Role == role) &&
                        (EF.Functions.ILike(m.User.Email, $"{search}%") || EF.Functions.ILike(m.User.FirstName, $"{search}%") || EF.Functions.ILike(m.User.LastName, $"{search}%")))
                        .OrderBy((m) => m.JoinedAt)
                        .Select(m => new
                        {
                            imageUrl = Helper.StorageUrl(m.User.ImageName),
                            email = m.User.Email,
                            name = $"{m.User.FirstName} {m.User.LastName}",
                            role = m.Role.ToString(),
                            joinedAt = m.JoinedAt,
                            id = m.User.Id,
                        })
                        .Skip((page - 1) * take)
                        .Take(take)
                        .ToListAsync();

            return HttpResult.Ok(body: new { members, count });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    // TODO redirect to the error page for each error
    [HttpDelete("delete-member/{projectId}/{memberId}"), Authorized]
    public async Task<IActionResult> DeleteMember([FromRoute] string projectId, [FromRoute] string memberId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isOwner = await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.IsJoined && m.UserId == userId && m.Role == Role.owner);

            if (!isOwner) return HttpResult.Forbidden("you are not authorized to delete a member");

            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.IsJoined && m.UserId == memberId)
                    .Include(m => m.User)
                    .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound("the member to delete is not found");

            var name = $"{member.User.FirstName} {member.User.LastName}";

            await _data.DeleteMemberActivity(projectId, name, _ctx);

            _ctx.Members.Remove(member);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"member {name} successfully deleted form project");
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

            var member = await _ctx.Members
                    .Where(m => m.ProjectId == projectId && m.IsJoined && m.UserId == dto.MemberId)
                    .Include(m => m.User)
                    .FirstOrDefaultAsync();

            if (member is null) return HttpResult.NotFound("the member is not found");

            var newRole = Enum.Parse<Role>(dto.Role);

            var name = $"{member.User.FirstName} {member.User.LastName}";

            var massage = $"member {name} role successfully changed from {member.Role.ToString()} to {newRole.ToString()}";

            await _data.ChangeMemberRoleActivity(projectId, name, member.Role, newRole, _ctx);

            member.Role = newRole;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok(massage);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
