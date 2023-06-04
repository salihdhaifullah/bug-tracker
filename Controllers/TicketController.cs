using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Buegee.Utils.Utils;

[ApiRoute("project")]
[Consumes("application/json")]
public class TicketController : Controller
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;

    public TicketController(DataContext ctx, IAuthService auth)
    {
        _auth = auth;
        _ctx = ctx;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var ticket = new Ticket()
        {
            Name = dto.Name,
            CreatorId = userId
        };

        if (dto.Type is not null) ticket.Type = Enum.Parse<TicketType>(dto.Type);
        if (dto.Status is not null) ticket.Status = Enum.Parse<TicketStatus>(dto.Status);
        if (dto.Priority is not null) ticket.Priority = Enum.Parse<TicketPriority>(dto.Priority);

        if (dto.AssignedToId is not null)
        {
            var isFound = await _ctx.Members.AnyAsync(m => m.Id == dto.AssignedToId);
            if (isFound) return NotFoundResult("user is not found to assignee ticket to");
            ticket.AssignedToId = dto.AssignedToId;
        }

        await _ctx.Tickets.AddAsync(ticket);

        await _ctx.SaveChangesAsync();

        return OkResult($"Ticket {dto.Name} successfully created");
    }

    [HttpGet("tickets/{page?}")]
    public async Task<IActionResult> GetTickets([FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return NotFoundResult("no projects found for you, to create project please sing-up");

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

        if (projects is null || projects.Count == 0) return NotFoundResult("sorry, no project found");

        return OkResult(null, projects);
    }

    [HttpGet("{ticketId}")]
    public async Task<IActionResult> GetTicket([FromRoute] int ticketId)
    {
        if (!_auth.TryGetUser(HttpContext, out var user) || user is null) return NotFoundResult("ticket not found");

        var ticket = await _ctx.Tickets
                        .Where((t) => t.Id == ticketId)
                        .Select((t) => new
                        {
                            createdAt = t.CreatedAt,
                            creator = new
                            {
                                firstName = t.Creator.FirstName,
                                lastName = t.Creator.LastName,
                                imageId = t.Creator.ImageUrl,
                                id = t.Creator.Id,
                            },
                            assignedTo = t.AssignedTo != null ? new
                            {
                                firstName = t.AssignedTo.User.FirstName,
                                lastName = t.AssignedTo.User.LastName,
                                imageId = t.AssignedTo.User.ImageUrl,
                                id = t.AssignedTo.User.Id,
                            } : null,
                            name = t.Name,
                            priority = t.Priority.ToString(),
                            status = t.Status.ToString(),
                            type = t.Type.ToString(),
                        })
                        .FirstOrDefaultAsync();

        if (ticket is null) return NotFoundResult("ticket not found");

        return OkResult(body: ticket);
    }

    [HttpDelete("{ticketId}")]
    public async Task<IActionResult> DeleteTicket([FromRoute] int ticketId)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return UnAuthorizedResult("unauthorized");

        var ticket = await _ctx.Tickets.Where((t) => t.Id == ticketId && t.Creator.Id == userId).FirstOrDefaultAsync();

        if (ticket is null) return NotFoundResult("sorry, ticket not found");

        _ctx.Tickets.Remove(ticket);

        await _ctx.SaveChangesAsync();

        return OkResult($"ticket \"{ticket.Name}\" successfully deleted");
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetTicketsCount([FromQuery] int take = 10)
    {
        if (!_auth.TryGetUser(HttpContext, out var userId) || userId is null) return NotFoundResult("no projects found for you, to create project please sing-up");

        var projectsCount = await _ctx.Projects.Where((p) => p.OwnerId == userId).CountAsync();

        int pages = (int)Math.Ceiling((double)projectsCount / take);


        return OkResult(null, pages);

    }
}
