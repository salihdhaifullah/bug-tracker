using Buegee.Data;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("users/{userId}/projects/{projectId}/tickets/chart")]
[ApiController]
public class TicketsChartController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<TicketsChartController> _logger;

    public TicketsChartController(DataContext ctx, ILogger<TicketsChartController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetTicketsChart(string projectId)
    {
        try
        {
            var data = await _ctx.Projects
            .Where(p => p.Id == projectId)
            .Select((p) => new
            {
                type = new
                {
                    bugs = p.Tickets.Where(t => t.Type == TicketType.bug).Count(),
                    features = p.Tickets.Where(t => t.Type == TicketType.feature).Count(),
                },
                status = new
                {
                    review = p.Tickets.Where(t => t.Status == Status.review).Count(),
                    active = p.Tickets.Where(t => t.Status == Status.active).Count(),
                    progress = p.Tickets.Where(t => t.Status == Status.in_progress).Count(),
                    resolved = p.Tickets.Where(t => t.Status == Status.resolved).Count(),
                    closed = p.Tickets.Where(t => t.Status == Status.closed).Count(),
                },
                priority = new
                {
                    low = p.Tickets.Where(t => t.Priority == Priority.low).Count(),
                    medium = p.Tickets.Where(t => t.Priority == Priority.medium).Count(),
                    high = p.Tickets.Where(t => t.Priority == Priority.high).Count(),
                    critical = p.Tickets.Where(t => t.Priority == Priority.critical).Count(),
                }
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
