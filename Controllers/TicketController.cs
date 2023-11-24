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

    record AssignedTo(string email, string name);

    private async Task<AssignedTo?> getAssignedTo(string id, string projectId)
    {
        var assignedTo = await _ctx.Members
                    .Where(m => m.Id == id && m.ProjectId == projectId)
                    .Select(m => new AssignedTo(m.User.Email, $"{m.User.FirstName} {m.User.LastName}"))
                    .FirstOrDefaultAsync();


        return assignedTo;
    }

    [HttpPost("{projectId}"), BodyValidation, Authorized]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            AssignedTo? assignedTo = null;

            if (dto.MemberId is not null)
            {
                assignedTo = await getAssignedTo(dto.MemberId, projectId);
                if (assignedTo is null) return HttpResult.NotFound("user is not found to assignee ticket to");
            }

            if (!await _ctx.Members.AnyAsync(m => m.ProjectId == projectId && m.UserId == userId
            && (m.Role == Role.project_manger || m.Role == Role.owner)))
                return HttpResult.Forbidden("you are not authorized to create a ticket in this project");


            var contentId = Ulid.NewUlid().ToString();
            var ticketId = Ulid.NewUlid().ToString();

            var ticketType = Enum.Parse<TicketType>(dto.Type);
            var ticketStatus = Enum.Parse<Status>(dto.Status);
            var ticketPriority = Enum.Parse<Priority>(dto.Priority);

            var creatorId = await _ctx.Members.Where(m => m.ProjectId == projectId && m.UserId == userId).Select(m => m.Id).FirstOrDefaultAsync();

            if (string.IsNullOrEmpty(creatorId)) return HttpResult.Forbidden("you are not authorized to create a ticket in this project");

            var content = await _ctx.Contents.AddAsync(new Content() { Id = contentId });
            var ticket = await _ctx.Tickets.AddAsync(new Ticket()
            {
                Name = dto.Name,
                CreatorId = creatorId,
                ProjectId = projectId,
                ContentId = contentId,
                Type = ticketType,
                Status = ticketStatus,
                Priority = ticketPriority,
                Id = ticketId,
                AssignedToId = dto.MemberId
            });

            await _data.CreateTicketActivity(projectId, dto.Name, ticketType, ticketStatus, assignedTo?.name, ticketPriority, _ctx);

            await _ctx.SaveChangesAsync();

            if (assignedTo is not null) _email.TicketAssignation(assignedTo.email, assignedTo.name, dto.Name, ticketType, ticketStatus, ticketPriority);

            return HttpResult.Ok($"Ticket {dto.Name} successfully created", redirectTo: $"/project/{projectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("my-tickets"), Authorized]
    public async Task<IActionResult> TicketsTable()
    {
        try
        {
            var userId = _auth.GetId(Request);
            var tickets = await _ctx.Tickets
                        .Where(t => t.AssignedTo != null && t.AssignedTo.UserId == userId)
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
                                            && EF.Functions.ILike(t.Name, $"{search}%")).CountAsync();


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
                          && EF.Functions.ILike(t.Name, $"{search}%"))
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
                                    imageUrl = Helper.StorageUrl(t.Creator.User.ImageName),
                                    id = t.Creator.Id,
                                },
                                assignedTo = t.AssignedTo != null ? new
                                {
                                    name = $"{t.AssignedTo.User.FirstName} {t.AssignedTo.User.LastName}",
                                    imageUrl = Helper.StorageUrl(t.AssignedTo.User.ImageName),
                                    id = t.AssignedTo.User.Id,
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

            await _data.DeleteTicketActivity(ticket.ProjectId, ticket.Name, $"{ticket.Creator.User.FirstName} {ticket.Creator.User.LastName}", _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"ticket \"{ticket.Name}\" successfully deleted");
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

            await _data.UpdateTicketStatusActivity(ticket.ProjectId, ticket.Name, ticket.Status, ticketStatus, _ctx);

            ticket.Status = ticketStatus;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"Ticket {ticket.Name} successfully updated");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpPatch("{ticketId}"), BodyValidation, Authorized]
    public async Task<IActionResult> UpdateTicket([FromBody] UpdateTicketDTO dto, [FromRoute] string ticketId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var ticket = await _ctx.Tickets.Where((t) => t.Id == ticketId && (t.Project.Members.Any(m => (m.Role == Role.owner || m.Role == Role.project_manger) && m.UserId == userId))).FirstOrDefaultAsync();

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

            await _data.UpdateTicketActivity(ticket.ProjectId, ticket.Name, ticket.Type, ticket.Status, ticket.AssignedTo != null ? $"{ticket.AssignedTo.User.FirstName} {ticket.AssignedTo.User.LastName}" : null, ticket.Priority, dto.Name, ticketType, ticketStatus, assignedTo != null ? assignedTo.name : null, ticketPriority, _ctx);

            ticket.AssignedToId = dto.MemberId;
            ticket.Name = dto.Name;
            ticket.Type = ticketType;
            ticket.Status = ticketStatus;
            ticket.Priority = ticketPriority;

            await _ctx.SaveChangesAsync();

            if (assignedTo is not null) _email.TicketAssignation(assignedTo.email, assignedTo.name, dto.Name, ticketType, ticketStatus, ticketPriority);

            return HttpResult.Ok($"Ticket {dto.Name} successfully updated", redirectTo: $"/project/{ticket.ProjectId}");
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
            if (!isAllowed) return HttpResult.Forbidden("you are not allowed to do this action", redirectTo: "/403");

            var content = await _ctx.Tickets
                          .Where(t => t.Id == ticketId)
                          .Include(t => t.Content)
                          .ThenInclude(c => c.Documents)
                          .Select(t => t.Content)
                          .FirstOrDefaultAsync();

            if (content is null) return HttpResult.UnAuthorized();

            await _data.EditContent(dto, content, _ctx);

            return HttpResult.Ok("successfully changed content");
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
