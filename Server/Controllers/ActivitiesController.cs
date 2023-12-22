using Buegee.Data;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/activities")]
[ApiController]
public class ActivitiesController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<ActivitiesController> _logger;

    public ActivitiesController(DataContext ctx, ILogger<ActivitiesController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpGet("{page}")]
    public async Task<IActionResult> GetActivities([FromRoute] string projectId, [FromRoute] int page, [FromQuery] int take, [FromQuery] string sort)
    {
        try
        {
            var query = _ctx.Activities.Where(a => a.ProjectId == projectId);

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

    [HttpGet("count")]
    public async Task<IActionResult> GetActivityCount([FromRoute] string projectId)
    {
        try
        {
            var count = await _ctx.Activities.Where(a => a.ProjectId == projectId).CountAsync();
            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
