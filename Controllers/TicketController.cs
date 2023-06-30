using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
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
    private readonly ILogger<TicketController> _logger;

    public TicketController(DataContext ctx, ILogger<TicketController> logger, IEmailService email, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _email = email;
    }

    record AssignedTo(string email, string name);

    private async Task<AssignedTo?> getAssignedTo(string email)
    {
        var assignedTo = await _ctx.Members
                    .Where(m => m.User.Email == email)
                    .Select(m => new AssignedTo(m.User.Email, $"{m.User.FirstName} {m.User.LastName}"))
                    .FirstOrDefaultAsync();

        return assignedTo;
    }

    [HttpPost("{projectId}"), Validation, Authorized]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            AssignedTo? assignedTo = null;

            if (dto.MemberId is not null)
            {
                assignedTo = await getAssignedTo(dto.MemberId);
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

            var content = await _ctx.Contents.AddAsync(new Content() { Id = contentId });
            var ticket = await _ctx.Tickets.AddAsync(new Ticket()
            {
                Name = dto.Name,
                CreatorId = userId,
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

            if (assignedTo is not null) await _email.TicketAssignation(assignedTo.email, assignedTo.name, dto.Name, ticketType, ticketStatus, ticketPriority);

            return HttpResult.Ok($"Ticket {dto.Name} successfully created", redirectTo: $"/project/{projectId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("tickets/{page?}"), Authorized]
    public async Task<IActionResult> GetTickets([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var projects = await _ctx.Projects
                            .Where((p) => p.Members.Any(m => m.UserId == userId))
                            .OrderBy((p) => p.CreatedAt)
                            .Select((p) => new
                            {
                                members = p.Members.Count + 1,
                                tickets = p.Tickets.Count,
                                createdAt = p.CreatedAt,
                                id = p.Id,
                                isPrivate = p.IsPrivate,
                                name = p.Name
                            })
                            .Skip((page - 1) * take)
                            .Take(take)
                            .ToListAsync();

            if (projects is null || projects.Count == 0) return HttpResult.NotFound("sorry, no project found");

            return HttpResult.Ok(null, projects);
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
                                    firstName = t.Creator.FirstName,
                                    lastName = t.Creator.LastName,
                                    imageUrl = Helper.StorageUrl(t.Creator.ImageName),
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
            var userId = (string)(HttpContext.Items["id"])!;

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

    [HttpGet("count"), Authorized]
    public async Task<IActionResult> GetTicketsCount([FromQuery] int take = 10)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var projectsCount = await _ctx.Projects
            .Where((p) => p.Members.Any(m => m.UserId == userId))
            .CountAsync();

            int pages = (int)Math.Ceiling((double)projectsCount / take);

            return HttpResult.Ok(null, pages);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("content/{ticketId}"), Authorized, Validation]
    public async Task<IActionResult> Profile([FromBody] ContentDTO dto, [FromRoute] string ticketId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var isAllowed = await _ctx.Projects
                    .AnyAsync(p => p.Tickets.Any(t => t.Id == ticketId) && p.Members.Any(m => m.UserId == userId
                    && (m.Role == Role.owner || m.Role == Role.project_manger)));

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
    public async Task<IActionResult> GetProfile([FromRoute] string ticketId)
    {
        try
        {
            var content = await _ctx.Tickets
                    .Where(t => t.Id == ticketId)
                    .Select(t => t.Content)
                    .Include(c => c.Documents)
                    .FirstOrDefaultAsync();

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
