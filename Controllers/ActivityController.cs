using Buegee.Data;
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
    private readonly ILogger<ActivityController> _logger;

    public ActivityController(DataContext ctx, ILogger<ActivityController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpGet("activities-table/{projectId}")]
    public async Task<IActionResult> ActivitiesTable([FromRoute] string projectId, [FromQuery] int take = 10, [FromQuery] int page = 1, [FromQuery] string sort = "oldest")
    {
        try
        {
            var count = await _ctx.Activities.Where(a => a.ProjectId == projectId).CountAsync();

            var query = _ctx.Activities.Where(a => a.ProjectId == projectId);

            if (sort == "latest") query = query.OrderByDescending(a => a.CreatedAt);
            else query = query.OrderBy(a => a.CreatedAt);

            var activities = await query.Select(a => new
            {
                content = a.Content,
                createdAt = a.CreatedAt,
            })
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

            return HttpResult.Ok(body: new { activities, count });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
