using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[Route("users/{userId}/projects/{projectId}/tickets/assigned")]
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

    [HttpGet]
    public async Task<IActionResult> GetAssignedTickets([FromRoute] string projectId, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search)
    {
        try
        {
            TicketType? type = null;
            if (!string.IsNullOrEmpty(typeQuery) && Enum.TryParse<TicketType>(typeQuery, out TicketType parsedType)) type = parsedType;
            Priority? priority = null;
            if (!string.IsNullOrEmpty(priorityQuery) && Enum.TryParse<Priority>(priorityQuery, out Priority parsedPriority)) priority = parsedPriority;

            var userId = _auth.GetId(Request);
            var tickets = await _ctx.Tickets
                        .Where(t =>
                        t.ProjectId == projectId
                        && t.AssignedTo != null
                        && t.AssignedTo.UserId == userId
                        && (type == null || t.Type == type)
                        && (priority == null || t.Priority == priority)
                        && EF.Functions.ILike(t.Name, $"%{search}%"))
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
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("{ticketId}"), BodyValidation, Authorized]
    public async Task<IActionResult> UpdateAssignedTicket([FromBody] TicketStatusDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets.Where((t) => t.Id == dto.TicketId && t.Creator.UserId == userId).FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("sorry, ticket not found");

            var ticketStatus = Enum.Parse<Status>(dto.Status);

            if (ticketStatus != ticket.Status)
            {
                await _data.AddActivity(ticket.ProjectId,
                $"changed ticket [{ticket.Name}](/tickets/{ticket.Id}) " +
                $"status from **{ticket.Status}** to **{ticketStatus}**", _ctx);
                ticket.Status = ticketStatus;

                await _ctx.SaveChangesAsync();
            }

            return HttpResult.Ok("successfully changed ticket status");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
