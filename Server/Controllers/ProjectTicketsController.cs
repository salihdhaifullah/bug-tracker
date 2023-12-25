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
[ApiRoute("users/{userId}/projects/{projectId}/tickets")]
[ApiController]
public class ProjectTicketsController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<ProjectTicketsController> _logger;

    public ProjectTicketsController(DataContext ctx, ILogger<ProjectTicketsController> logger, IDataService data, IAuthService auth)
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

    [HttpPost, BodyValidation, Authorized, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
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
                $"created ticket [{ticket.Entity.Name}](/users/{userId}/projects/{projectId}/tickets/{ticket.Entity.Id}) " +
                $"of type **{ticket.Entity.Type.ToString()}**, " +
                $"created by [{creator.name}](/users/{userId}), " +
                $"{assignedToText}" +
                $"status is **{ticket.Entity.Status.ToString()}** and " +
                $"priority is **{ticket.Entity.Priority.ToString()}**"
            , _ctx);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully created ticket", redirectTo: $"/users/{userId}/projects/{projectId}/tickets/{ticketId}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
