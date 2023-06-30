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

    [HttpPost("invent/{projectId}"), Validation, Authorized]
    public async Task<IActionResult> Invent([FromBody] InventDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var user = await _ctx.Users
                    .Where(u => u.Id == dto.InventedId)
                    .Select(u => new { fullName = $"{u.FirstName} {u.LastName}", email = u.Email })
                    .FirstOrDefaultAsync();

            if (user is null) return HttpResult.BadRequest("user to invent is not exist");

            var inventer = await _ctx.Users.Where(u => u.Id == userId)
                            .Select(u => new { fullName = $"{u.FirstName} {u.LastName}" })
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

            await _cache.Redis.StringSetAsync(sessionId, JsonSerializer.Serialize<Invention>(new Invention(projectId, dto.InventedId, user.fullName)), age);

            await _email.Invitation(user.email, user.fullName, project.name, role, inventer.fullName, $"{Helper.BaseUrl(Request)}/join-project/{sessionId}");

            return HttpResult.Ok($"successfully invented user {user.fullName}");
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


}
