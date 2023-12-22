using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[Route("users/{userId}/projects/{projectId}/members")]
[ApiController]
public class ProjectMembersController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<ProjectMembersController> _logger;
    private readonly IDataService _data;
    private readonly IAuthService _auth;

    public ProjectMembersController(DataContext ctx, ILogger<ProjectMembersController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }


    [HttpGet]
    public async Task<IActionResult> GetMembers([FromRoute] string projectId,
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

    [HttpPost, BodyValidation, Authorized]
    public async Task<IActionResult> AddMember([FromBody] InviteDTO dto, [FromRoute] string userId, [FromRoute] string projectId)
    {
        try
        {
            if (_auth.GetId(Request) != userId) return HttpResult.UnAuthorized();

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

    [HttpDelete, Authorized]
    public async Task<IActionResult> RemoveMember(string projectId)
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
                await _data.AddActivity(projectId,
                        $"user [{member.User.FirstName} {member.User.LastName}](/profile/{userId}) left the project",
                         _ctx);

                return HttpResult.Ok(massage: "successfully left project", redirectTo: $"/profile/{userId}");
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("none-members")]
    public async Task<IActionResult> GetNonMembers([FromQuery] string email, [FromRoute] string projectId)
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


    [HttpGet("role")]
    public async Task<IActionResult> GetRole(string projectId, string memberId)
    {
        try
        {

            var role = await _ctx.Members
                .Where(m => m.ProjectId == projectId && m.Id == memberId)
                .Select(m => m.Role.ToString())
                .FirstOrDefaultAsync();

            return HttpResult.Ok(body: role);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("chart")]
    public async Task<IActionResult> GetMembersChart(string projectId)
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
}
