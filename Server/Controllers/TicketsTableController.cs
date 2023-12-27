using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Services.EmailService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/table")]
[ApiController]
public class TicketsTableController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<TicketsTableController> _logger;

    public TicketsTableController(DataContext ctx, ILogger<TicketsTableController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }


    [HttpGet("{page}"), ProjectRead]
    public async Task<IActionResult> GetTicketsTable([FromRoute] string projectId, [FromRoute] int page, [FromQuery(Name = "status")] string? statusQuery, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search, [FromQuery] int take = 10)
    {
        try
        {
            var status = Helper.ParseEnum<Status>(statusQuery);
            var type = Helper.ParseEnum<TicketType>(typeQuery);
            var priority = Helper.ParseEnum<Priority>(priorityQuery);

            var tickets = await _ctx.Tickets.Where(t => t.ProjectId == projectId
                          && (status == null || t.Status == status)
                          && (type == null || t.Type == type)
                          && (priority == null || t.Priority == priority)
                          && EF.Functions.ILike(t.Name, $"%{search}%"))
                        .OrderBy(t => t.Status)
                        .ThenByDescending(t => t.Priority)
                        .ThenBy(t => t.Type)
                        .ThenBy(t => t.CreatedAt)
                        .Select(t => new
                        {
                            name = t.Name,
                            createdAt = t.CreatedAt,
                            creator = new
                            {
                                id = t.Creator.UserId,
                                name = $"{t.Creator.User.FirstName} {t.Creator.User.LastName}",
                            },
                            assignedTo = t.AssignedTo == null ? null : new
                            {
                                id = t.AssignedTo.UserId,
                                memberId = t.AssignedToId,
                                name = $"{t.AssignedTo.User.FirstName} {t.AssignedTo.User.LastName}",
                            },
                            id = t.Id,
                            priority = t.Priority.ToString(),
                            status = t.Status.ToString(),
                            type = t.Type.ToString(),
                        })
                        .Skip((page - 1) * take)
                        .Take(take)
                        .ToListAsync();

            return HttpResult.Ok(body: tickets);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("count"), ProjectRead]
    public async Task<IActionResult> GetTicketsTableCount([FromRoute] string projectId, [FromQuery(Name = "status")] string? statusQuery, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search)
    {
        try
        {
            var status = Helper.ParseEnum<Status>(statusQuery);
            var type = Helper.ParseEnum<TicketType>(typeQuery);
            var priority = Helper.ParseEnum<Priority>(priorityQuery);

            var count = await _ctx.Tickets.Where(t => t.ProjectId == projectId
                                            && (status == null || t.Status == status)
                                            && (type == null || t.Type == type)
                                            && (priority == null || t.Priority == priority)
                                            && EF.Functions.ILike(t.Name, $"%{search}%")).CountAsync();


            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
