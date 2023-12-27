using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/assigned")]
[ApiController]
public class AssignedTicketsController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly ILogger<AssignedTicketsController> _logger;
    private readonly IAuthService _auth;
    private readonly IDataService _data;

    public AssignedTicketsController(DataContext ctx, IAuthService auth, IDataService data, ILogger<AssignedTicketsController> logger)
    {
        _ctx = ctx;
        _logger = logger;
        _auth = auth;
        _data = data;
    }

    [HttpGet, Authorized, ProjectMember]
    public async Task<IActionResult> GetAssignedTickets([FromRoute] string projectId, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var type = Helper.ParseEnum<TicketType>(typeQuery);
            var priority = Helper.ParseEnum<Priority>(priorityQuery);

            var tickets = await _ctx.Tickets
                        .Where(t => t.ProjectId == projectId)
                        .Where(t => t.AssignedTo != null)
                        .Where(t => t.AssignedTo!.UserId == userId)
                        .Where(t => type == null || t.Type == type)
                        .Where(t => priority == null || t.Priority == priority)
                        .Where(t => EF.Functions.ILike(t.Name, $"%{search}%"))
                        .OrderBy(t => t.Priority)
                        .ThenBy(t => t.CreatedAt)
                        .Select(t => new
                        {
                            name = t.Name,
                            id = t.Id,
                            priority = t.Priority.ToString(),
                            status = t.Status.ToString(),
                            type = t.Type.ToString(),
                        })
                        .ToListAsync();

            return HttpResult.Ok(body: tickets);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch, BodyValidation, Authorized, ProjectArchive]
    public async Task<IActionResult> UpdateAssignedTicket([FromBody] TicketStatusDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets
                .Where(t => t.Id == dto.TicketId)
                .Where(t => t.AssignedTo != null)
                .Where(t => t.AssignedTo!.UserId == userId)
                .FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("ticket not found");

            var ticketStatus = Enum.Parse<Status>(dto.Status);

            if (ticketStatus != ticket.Status)
            {
                await _data.AddActivity(ticket.ProjectId,
                $"changed ticket [{ticket.Name}](/users/{userId}/projects/{ticket.ProjectId}/tickets/{ticket.Id}) " +
                $"status from **{ticket.Status}** to **{ticketStatus}**", _ctx);

                ticket.Status = ticketStatus;

                await _ctx.SaveChangesAsync();
            }

            return HttpResult.Ok("successfully changed ticket status");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
