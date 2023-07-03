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
    public async Task<IActionResult> ActivitiesTable([FromRoute] string projectId)
    {
        try
        {
            var activities = await _ctx.Activities
                        .Where(a => a.Id == projectId)
                        .OrderBy(a => a.CreatedAt)
                        .Select(a => new
                        {
                            description = a.Markdown,
                            createdAt = a.CreatedAt,
                        })
                        .ToListAsync();

            if (activities is null) return HttpResult.NotFound("page not found");

            return HttpResult.Ok(body: activities);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
