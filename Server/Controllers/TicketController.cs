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

[ApiRoute("ticket")]
[Consumes("application/json")]
public class TicketController : Controller
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IEmailService _email;
    private readonly IAuthService _auth;
    private readonly ILogger<TicketController> _logger;

    public TicketController(DataContext ctx, ILogger<TicketController> logger, IEmailService email, IDataService data, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _email = email;
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

    [HttpGet("chart/{projectId}"), Authorized]
    public async Task<IActionResult> TicketChart([FromRoute] string projectId)
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

    [HttpPost("{projectId}"), BodyValidation, Authorized]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            AssignedTo? assignedTo = null;
            string assignedToText = "";

            if (dto.MemberId is not null)
            {
                assignedTo = await getAssignedTo(dto.MemberId, projectId);
                if (assignedTo is null) return HttpResult.NotFound("user is not found to assignee ticket to");
                assignedToText = $"assigned to [{assignedTo.name}](/profile/{assignedTo.userId}), ";
            }

            if (!await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId
            && (m.Role == Role.project_manger || m.Role == Role.owner)))
                return HttpResult.Forbidden("you are not authorized to create a ticket in this project");


            var contentId = Ulid.NewUlid().ToString();
            var ticketId = Ulid.NewUlid().ToString();

            var ticketType = Enum.Parse<TicketType>(dto.Type);
            var ticketStatus = Enum.Parse<Status>(dto.Status);
            var ticketPriority = Enum.Parse<Priority>(dto.Priority);

            var creator = await _ctx.Members
            .Where(m => m.ProjectId == projectId && m.UserId == userId)
            .Select(m => new { name = $"{m.User.FirstName} {m.User.LastName}", id = m.Id })
            .FirstOrDefaultAsync();

            if (creator is null) return HttpResult.Forbidden("you are not authorized to create a ticket in this project");

            var content = await _ctx.Contents.AddAsync(new Content() { Id = contentId });
            var ticket = await _ctx.Tickets.AddAsync(new Ticket()
            {
                Name = dto.Name,
                CreatorId = creator.id,
                ProjectId = projectId,
                ContentId = contentId,
                Type = ticketType,
                Status = ticketStatus,
                Priority = ticketPriority,
                Id = ticketId,
                AssignedToId = dto.MemberId
            });

            await _data.AddActivity(
                projectId,
                $"created ticket [{ticket.Entity.Name}](/tickets/{ticket.Entity.Id}) " +
                $"of type **{ticket.Entity.Type.ToString()}**, " +
                $"created by [{creator.name}](/profile/{userId}), " +
                $"{assignedToText}" +
                $"status is **{ticket.Entity.Status.ToString()}** and " +
                $"priority is **{ticket.Entity.Priority.ToString()}**"
            , _ctx);

            await _ctx.SaveChangesAsync();

            if (assignedTo is not null) _email.TicketAssignation(assignedTo.email, assignedTo.name, dto.Name, ticketType, ticketStatus, ticketPriority);

            return HttpResult.Ok("successfully created ticket", redirectTo: $"/tickets/{ticketId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("my-tickets/{projectId}"), Authorized]
    public async Task<IActionResult> TicketsTable([FromRoute] string projectId, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search)
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

    [HttpGet("tickets-count/{projectId}"), Authorized]
    public async Task<IActionResult> TicketsCount([FromRoute] string projectId, [FromQuery(Name = "status")] string? statusQuery, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search)
    {
        try
        {
            Status? status = null;
            if (!string.IsNullOrEmpty(statusQuery) && Enum.TryParse<Status>(statusQuery, out Status parsedStatus)) status = parsedStatus;
            TicketType? type = null;
            if (!string.IsNullOrEmpty(typeQuery) && Enum.TryParse<TicketType>(typeQuery, out TicketType parsedType)) type = parsedType;
            Priority? priority = null;
            if (!string.IsNullOrEmpty(priorityQuery) && Enum.TryParse<Priority>(priorityQuery, out Priority parsedPriority)) priority = parsedPriority;


            var count = await _ctx.Tickets.Where(t => t.ProjectId == projectId
                                            && (status == null || t.Status == status)
                                            && (type == null || t.Type == type)
                                            && (priority == null || t.Priority == priority)
                                            && EF.Functions.ILike(t.Name, $"%{search}%")).CountAsync();


            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpGet("tickets/{projectId}"), Authorized]
    public async Task<IActionResult> Tickets([FromRoute] string projectId, [FromQuery(Name = "status")] string? statusQuery, [FromQuery(Name = "type")] string? typeQuery, [FromQuery(Name = "priority")] string? priorityQuery, [FromQuery] string? search, [FromQuery] int take = 10, [FromQuery] int page = 1)
    {
        try
        {
            Status? status = null;
            if (!string.IsNullOrEmpty(statusQuery) && Enum.TryParse<Status>(statusQuery, out Status parsedStatus)) status = parsedStatus;
            TicketType? type = null;
            if (!string.IsNullOrEmpty(typeQuery) && Enum.TryParse<TicketType>(typeQuery, out TicketType parsedType)) type = parsedType;
            Priority? priority = null;
            if (!string.IsNullOrEmpty(priorityQuery) && Enum.TryParse<Priority>(priorityQuery, out Priority parsedPriority)) priority = parsedPriority;

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
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpGet("{ticketId}")]
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
                                    id = t.Creator.Id,
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

            if (ticket is null) return HttpResult.NotFound("ticket not found");

            return HttpResult.Ok(body: ticket);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpDelete("{ticketId}"), Authorized]
    public async Task<IActionResult> DeleteTicket([FromRoute] string ticketId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets.Where((t) => t.Id == ticketId && t.Creator.UserId == userId).Include(t => t.Creator).ThenInclude(c => c.User).FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("sorry, ticket not found");

            _ctx.Tickets.Remove(ticket);

            await _data.AddActivity(ticket.ProjectId,
            $"ticket **{ticket.Name.Trim()}** deleted by [{ticket.Creator.User.FirstName} {ticket.Creator.User.LastName}](/profile/{ticket.Creator.UserId})",
             _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted ticket", redirectTo: $"/project/{ticket.ProjectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("status"), BodyValidation, Authorized]
    public async Task<IActionResult> UpdateTicketStatus([FromBody] TicketStatusDTO dto)
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


    record Change(string Property, string OldValue, string NewValue);

    [HttpPatch("{ticketId}"), BodyValidation, Authorized]
    public async Task<IActionResult> UpdateTicket([FromBody] UpdateTicketDTO dto, [FromRoute] string ticketId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets
            .Where((t) => t.Id == ticketId
            && (t.Project.Members.Any(m => (m.Role == Role.owner || m.Role == Role.project_manger) && m.UserId == userId))
            )
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
                ticket.AssignedTo != null ? $"[{ticket.AssignedTo.User.FirstName} {ticket.AssignedTo.User.LastName}](/profile/{ticket.AssignedTo.UserId})" : "**none**",
                assignedTo != null ? $"[{assignedTo.name}](/profile/{assignedTo.userId})" : "**none**"));

                ticket.AssignedToId = dto.MemberId;
            }

            if (changes.Count > 0)
            {
                sb.Append($"ticket [{ticket.Name}](/tickets/{ticket.Id}) ");

                for (var i = 0; i < changes.Count; i++)
                {
                    if (i != 0) sb.Append(", ");
                    sb.Append($"{changes[i].Property} changed from {changes[i].OldValue} to {changes[i].NewValue}");
                }

                await _data.AddActivity(ticket.ProjectId, sb.ToString(), _ctx);
                await _ctx.SaveChangesAsync();
            }


            if (assignedTo is not null) _email.TicketAssignation(assignedTo.email, assignedTo.name, dto.Name, ticketType, ticketStatus, ticketPriority);

            return HttpResult.Ok("successfully updated ticket");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("content/{ticketId}"), Authorized, BodyValidation]
    public async Task<IActionResult> EditTicketContent([FromBody] ContentDTO dto, [FromRoute] string ticketId)
    {
        try
        {
            var isAllowed = await _ctx.Tickets.AnyAsync(t => t.Creator.UserId == _auth.GetId(Request));
            if (!isAllowed) return HttpResult.Forbidden("you are not allowed to do this action");

            var content = await _ctx.Tickets
                          .Where(t => t.Id == ticketId)
                          .Include(t => t.Content)
                          .ThenInclude(c => c.Documents)
                          .Select(t => t.Content)
                          .FirstOrDefaultAsync();

            if (content is null) return HttpResult.UnAuthorized();

            await _data.EditContent(dto, content, _ctx);

            await _ctx.SaveChangesAsync();
            return HttpResult.Ok("successfully updated content");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("content/{ticketId}")]
    public async Task<IActionResult> GetTicketContent([FromRoute] string ticketId)
    {
        try
        {
            var content = await _ctx.Tickets.Where(t => t.Id == ticketId).Select(t => new { markdown = t.Content.Markdown }).FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

            return HttpResult.Ok(body: content);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
