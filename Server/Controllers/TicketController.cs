using System.Text;
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

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("projects/{projectId}/tickets/{ticketId}")]
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

    record AssignedTo(string Name, string UserId);

    record Change(string Property, string OldValue, string NewValue);

    [HttpPatch, Authorized, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> UpdateTicket([FromRoute] string ticketId, [FromBody] UpdateTicketDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets
                .Where(t => t.Id == ticketId)
                .Include(t => t.AssignedTo != null ? t.AssignedTo.User : null)
                .FirstOrDefaultAsync();

            if (ticket is null)
                return HttpResult.NotFound("Ticket not found");

            AssignedTo? assignedTo = null;

            if (dto.MemberId is not null)
            {
                assignedTo = await GetAssignedTo(dto.MemberId, ticket.ProjectId);
                if (assignedTo is null)
                    return HttpResult.NotFound("User to assign ticket to is not found");
            }

            var ticketType = Enum.Parse<TicketType>(dto.Type);
            var ticketStatus = Enum.Parse<Status>(dto.Status);
            var ticketPriority = Enum.Parse<Priority>(dto.Priority);

            var changes = new List<Change>();

            AddChange("name", ticket.Name, dto.Name, changes, () => ticket.Name = dto.Name);
            AddChange("type", ticket.Type.ToString(), ticketType.ToString(), changes, () => ticket.Type = ticketType);
            AddChange("status", ticket.Status.ToString(), ticketStatus.ToString(), changes, () => ticket.Status = ticketStatus);
            AddChange("priority", ticket.Priority.ToString(), ticketPriority.ToString(), changes, () => ticket.Priority = ticketPriority);
            AddChange("assignation", GetAssignationValue(ticket.AssignedTo != null ? new AssignedTo($"{ticket.AssignedTo.User.FirstName} {ticket.AssignedTo.User.LastName}", ticket.AssignedTo.UserId) : null), GetAssignationValue(assignedTo), changes, () => ticket.AssignedToId = dto.MemberId);

            if (changes.Count > 0)
            {
                var sb = new StringBuilder($"ticket [{ticket.Name}](/projects/{ticket.ProjectId}/tickets/{ticket.Id}) ");
                sb.Append(string.Join(", ", changes.Select(change => $"{change.Property} changed from {change.OldValue} to {change.NewValue}")));

                await _data.AddActivity(ticket.ProjectId, sb.ToString(), _ctx);
                await _ctx.SaveChangesAsync();
            }

            return HttpResult.Ok("Successfully updated ticket");
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return HttpResult.InternalServerError();
        }
    }

    private async Task<AssignedTo?> GetAssignedTo(string id, string projectId)
    {
        var assignedTo = await _ctx.Members
            .Where(m => m.Id == id && m.ProjectId == projectId)
            .Select(m => new AssignedTo($"{m.User.FirstName} {m.User.LastName}", m.UserId))
            .FirstOrDefaultAsync();

        return assignedTo;
    }

    private static void AddChange(string property, string oldValue, string newValue, List<Change> changes, Action updateAction)
    {
        if (oldValue != newValue)
        {
            changes.Add(new Change(property, $"**{oldValue.Trim()}**", $"**{newValue.Trim()}**"));
            updateAction.Invoke();
        }
    }

    private static string GetAssignationValue(AssignedTo? assignedTo)
    {
        return assignedTo != null ? $"[{assignedTo.Name}](/users/{assignedTo.UserId})" : "**none**";
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
                                status = t.Status.ToString(),
                                type = t.Type.ToString()
                            })
                            .FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("ticket not found", redirectTo: "/404");

            return HttpResult.Ok(body: ticket);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return HttpResult.InternalServerError();
        }
    }

    [HttpDelete, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> DeleteTicket([FromRoute] string ticketId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var userName = await _ctx.Users
                .Where(u => u.Id == userId)
                .Select(u => $"{u.FirstName} {u.LastName}")
                .FirstOrDefaultAsync();

            var ticket = await _ctx.Tickets
                    .Where((t) => t.Id == ticketId)
                    .FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("ticket not found");

            await _data.AddActivity(ticket.ProjectId,
            $"ticket **{ticket.Name.Trim()}** deleted by [{userName}](/users/{userId})",
             _ctx);

            _ctx.Tickets.Remove(ticket);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted ticket", redirectTo: $"/projects/{ticket.ProjectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return HttpResult.InternalServerError();
        }
    }
}
