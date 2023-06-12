using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
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
    private readonly ILogger<TicketController> _logger;

    public TicketController(DataContext ctx, ILogger<TicketController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpPost("{projectId}"), Validation, Authorized]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var isProjectFound = await _ctx.Projects.AnyAsync(p => p.Id == projectId && p.OwnerId == userId);

            if (!isProjectFound) return HttpResult.NotFound("project not found");

            var contentId = Ulid.NewUlid().ToString();
            var ticketId = Ulid.NewUlid().ToString();

            var content = await _ctx.Contents.AddAsync(new Content() { Id = contentId, OwnerId = userId });
            var ticket = await _ctx.Tickets.AddAsync(new Ticket()
            {
                Name = dto.Name,
                CreatorId = userId,
                ProjectId = projectId,
                ContentId = contentId,
                Type = Enum.Parse<TicketType>(dto.Type),
                Status = Enum.Parse<TicketStatus>(dto.Status),
                Priority = Enum.Parse<TicketPriority>(dto.Priority),
                Id = ticketId
            });

            if (dto.AssignedToEmail is not null)
            {
                var isFound = await _ctx.Members.Where(m => m.User.Email == dto.AssignedToEmail).Select(m => new {Id = m.Id}).FirstOrDefaultAsync();
                if (isFound is null) return HttpResult.NotFound("user is not found to assignee ticket to");
                ticket.Entity.AssignedToId = isFound.Id;
            }

            await _ctx.SaveChangesAsync();

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
                            .Where((p) => p.OwnerId == userId)
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
                                contentId = t.Content.Id,
                                comments = t.Comments.Select((c) => new {
                                    ownerId = c.CommenterId,
                                    contentId = c.Content.Id
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

            var projectsCount = await _ctx.Projects.Where((p) => p.OwnerId == userId).CountAsync();

            int pages = (int)Math.Ceiling((double)projectsCount / take);

            return HttpResult.Ok(null, pages);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
