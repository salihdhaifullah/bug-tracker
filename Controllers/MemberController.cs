using System.Text.Json;
using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
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

    public MemberController(DataContext ctx, ILogger<MemberController> logger, IEmailService email, IJWTService jwt, IDataService data, IRedisCacheService cache)
    {
        _ctx = ctx;
        _logger = logger;
        _email = email;
        _jwt = jwt;
        _cache = cache;
        _data = data;
    }

    private record Invention(string projectId, string userId, string userFullName);

    [HttpPost("invent/{projectId}"), BodyValidation, Authorized]
    public async Task<IActionResult> Invent([FromBody] InventDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

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
            var userId = (string)(HttpContext.Items["id"])!;

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
            var users = await _ctx.Users.Where(u => EF.Functions.ILike(u.Email, $"{email}%") && !u.MemberShips.Any(m => m.ProjectId == projectId && m.IsJoined))
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
            var members = await _ctx.Members.Where(m => EF.Functions.ILike(m.User.Email, $"{email}%") && m.ProjectId == projectId && m.IsJoined)
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

    [HttpGet("members-table/{projectId}"), Authorized]
    public async Task<IActionResult> MembersTable([FromRoute] string projectId)
    {
        try
        {
            var members = await _ctx.Members.Where(m => m.ProjectId == projectId && m.IsJoined)
                    .OrderBy((m) => m.JoinedAt)
                    .Select(m => new
                    {
                        imageUrl = Helper.StorageUrl(m.User.ImageName),
                        email = m.User.Email,
                        name = $"{m.User.FirstName} {m.User.LastName}",
                        role = m.Role,
                        joinedAt = m.JoinedAt,
                        id = m.User.Id,
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
}