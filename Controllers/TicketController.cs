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

    [HttpGet("tickets-table/{projectId}"), Authorized]
    public async Task<IActionResult> TicketsTable([FromRoute] string projectId)
    {
        try
        {
            var tickets = await _ctx.Tickets.Where(t => t.ProjectId == projectId)
                        .OrderBy(t => t.Priority)
                        .Select(t => new
                        {
                            name = t.Name,
                            createdAt = t.CreatedAt,
                            creator = new
                            {
                                id = t.Creator.User.Id,
                                name = $"{t.Creator.User.FirstName} {t.Creator.User.LastName}",
                            },
                            assignedTo = t.AssignedTo == null ? null : new
                            {
                                id = t.AssignedTo.User.Id,
                                name = $"{t.AssignedTo.User.FirstName} {t.AssignedTo.User.LastName}",
                            },
                            id = t.Id,
                            priority = t.Priority,
                            status = t.Status,
                            type = t.Type,
                        })
                        .Take(10)
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
                                    firstName = t.Creator.User.FirstName,
                                    lastName = t.Creator.User.LastName,
                                    imageUrl = Helper.StorageUrl(t.Creator.User.ImageName),
                                    id = t.Creator.Id,
                                },
                                assignedTo = t.AssignedTo != null ? new
                                {
                                    firstName = t.AssignedTo.User.FirstName,
                                    lastName = t.AssignedTo.User.LastName,
                                    imageUrl = Helper.StorageUrl(t.AssignedTo.User.ImageName),
                                    id = t.AssignedTo.User.Id,
                                } : null,
                                name = t.Name,
                                priority = t.Priority.ToString(),
                                status = t.Status.ToString(),
                                type = t.Type.ToString(),
                                comments = t.Comments.Select((c) => new
                                {
                                    id = c.Id,
                                    commenterId = c.CommenterId,
                                })
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

            var ticket = await _ctx.Tickets.Where((t) => t.Id == ticketId && t.Creator.Id == userId).FirstOrDefaultAsync();

            if (ticket is null) return HttpResult.NotFound("sorry, ticket not found");

            _ctx.Tickets.Remove(ticket);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"ticket \"{ticket.Name}\" successfully deleted");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
