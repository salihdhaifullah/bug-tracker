using System.Text;
using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
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
[ApiRoute("users/{userId}/projects/{projectId}/tickets/{ticketId}")]
[ApiController]
public class TicketController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<TicketController> _logger;

    public TicketController(DataContext ctx, ILogger<TicketController> logger, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }


    record AssignedTo(string email, string name, string userId);

    private async Task<AssignedTo?> getAssignedTo(string id, string projectId)
    {
        var assignedTo = await _ctx.Members
                    .Where(m => m.Id == id && m.ProjectId == projectId)
                    .Select(m => new AssignedTo(m.User.Email, $"{m.User.FirstName} {m.User.LastName}", m.UserId))
                    .FirstOrDefaultAsync();


        return assignedTo;
    }
    record Change(string Property, string OldValue, string NewValue);

    [HttpPatch, Authorized, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> UpdateTicket([FromRoute] string ticketId, [FromBody] UpdateTicketDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets
                .Where((t) => t.Id == ticketId)
                .Include(t => t.AssignedTo != null ? t.AssignedTo.User : null)
                .FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("sorry, ticket not found");

            AssignedTo? assignedTo = null;

            if (dto.MemberId is not null)
            {
                assignedTo = await getAssignedTo(dto.MemberId, ticket.ProjectId);
                if (assignedTo is null) return HttpResult.NotFound("user to assignee ticket to is not found");
            }

            var ticketType = Enum.Parse<TicketType>(dto.Type);
            var ticketStatus = Enum.Parse<Status>(dto.Status);
            var ticketPriority = Enum.Parse<Priority>(dto.Priority);

            var sb = new StringBuilder("");

            var changes = new List<Change>();

            if (ticket.Name != dto.Name)
            {
                changes.Add(new Change("name", $"**{ticket.Name.Trim()}**", $"**{dto.Name.Trim()}**"));
                ticket.Name = dto.Name;
            }
            if (ticket.Type != ticketType)
            {
                changes.Add(new Change("type", $"**{ticket.Type.ToString()}**", $"**{ticketType.ToString()}**"));
                ticket.Type = ticketType;
            }
            if (ticket.Status != ticketStatus)
            {
                changes.Add(new Change("status", $"**{ticket.Status.ToString()}**", $"**{ticketStatus.ToString()}**"));
                ticket.Status = ticketStatus;
            }
            if (ticket.Priority != ticketPriority)
            {
                changes.Add(new Change("priority", $"**{ticket.Priority.ToString()}**", $"**{ticketPriority.ToString()}**"));
                ticket.Priority = ticketPriority;
            }
            if (ticket.AssignedToId != dto.MemberId)
            {
                changes.Add(new Change("assignation",
                ticket.AssignedTo != null ? $"[{ticket.AssignedTo.User.FirstName} {ticket.AssignedTo.User.LastName}](/users/{ticket.AssignedTo.UserId})" : "**none**",
                assignedTo != null ? $"[{assignedTo.name}](/users/{assignedTo.userId})" : "**none**"));

                ticket.AssignedToId = dto.MemberId;
            }

            if (changes.Count > 0)
            {
                sb.Append($"ticket [{ticket.Name}](/users/{userId}/projects/{ticket.ProjectId}/tickets/{ticket.Id}) ");

                for (var i = 0; i < changes.Count; i++)
                {
                    if (i != 0) sb.Append(", ");
                    sb.Append($"{changes[i].Property} changed from {changes[i].OldValue} to {changes[i].NewValue}");
                }

                await _data.AddActivity(ticket.ProjectId, sb.ToString(), _ctx);
                await _ctx.SaveChangesAsync();
            }

            return HttpResult.Ok("successfully updated ticket");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet, ProjectRead]
    public async Task<IActionResult> GetTicket([FromRoute] string ticketId)
    {
        try
        {
            var ticket = await _ctx.Tickets
                            .Where((t) => t.Id == ticketId)
                            .Select((t) => new
                            {
                                createdAt = t.CreatedAt,
                                creator = new
                                {
                                    name = $"{t.Creator.User.FirstName} {t.Creator.User.LastName}",
                                    avatarUrl = t.Creator.User.AvatarUrl,
                                    id = t.Creator.UserId,
                                },
                                project = new
                                {
                                    name = t.Project.Name,
                                    id = t.ProjectId,
                                },
                                assignedTo = t.AssignedTo != null ? new
                                {
                                    name = $"{t.AssignedTo.User.FirstName} {t.AssignedTo.User.LastName}",
                                    avatarUrl = t.AssignedTo.User.AvatarUrl,
                                    id = t.AssignedTo.UserId,
                                    memberId = t.AssignedToId,
                                } : null,
                                name = t.Name,
                                priority = t.Priority.ToString(),
                                contentId = t.ContentId,
                                status = t.Status.ToString(),
                                type = t.Type.ToString()
                            })
                            .FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("ticket not found");

            return HttpResult.Ok(body: ticket);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpDelete, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> DeleteTicket([FromRoute] string ticketId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets
                    .Where((t) => t.Id == ticketId)
                    .FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("sorry, ticket not found");

            _ctx.Tickets.Remove(ticket);

            await _data.AddActivity(ticket.ProjectId,
            $"ticket **{ticket.Name.Trim()}** deleted by [{ticket.Creator.User.FirstName} {ticket.Creator.User.LastName}](/users/{ticket.Creator.UserId})",
             _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted ticket", redirectTo: $"/users/{userId}/projects/{ticket.ProjectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
