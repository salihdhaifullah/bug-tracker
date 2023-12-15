using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("activity")]
[Consumes("application/json")]
public class ActivityController : Controller
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly ILogger<ActivityController> _logger;

    public ActivityController(DataContext ctx, ILogger<ActivityController> logger, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _auth = auth;
    }

    [HttpGet("activities/{projectId}")]
    public async Task<IActionResult> Activities([FromRoute] string projectId, [FromQuery] int take = 10, [FromQuery] int page = 1, [FromQuery] string sort = "oldest")
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var query = _ctx.Activities.Where(a => a.ProjectId == projectId && (!a.Project.IsPrivate || a.Project.Members.Any(m => userId != null && m.UserId == userId)));

            if (sort == "oldest") query = query.OrderBy(a => a.CreatedAt);
            else query = query.OrderByDescending(a => a.CreatedAt);

            var activities = await query.Select(a => new
            {
                content = a.Content,
                createdAt = a.CreatedAt,
            })
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

            return HttpResult.Ok(body: activities);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("activities-count/{projectId}")]
    public async Task<IActionResult> ActivitiesCount([FromRoute] string projectId)
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var count = await _ctx.Activities.Where(a => a.ProjectId == projectId && (!a.Project.IsPrivate || a.Project.Members.Any(m => userId != null && m.UserId == userId))).CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

}
