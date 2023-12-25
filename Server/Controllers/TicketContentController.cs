using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/{ticketId}/content")]
[ApiController]
public class TicketContentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly ILogger<TicketContentController> _logger;


    public TicketContentController(DataContext ctx, ILogger<TicketContentController> logger, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
    }

    [HttpGet, ProjectRead]
    public async Task<IActionResult> GetContent([FromRoute] string ticketId)
    {
        try
        {
            var content = await _ctx.Tickets
                        .Where(t => t.Id == ticketId)
                        .Select(t => new { markdown = t.Content.Markdown })
                        .FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

            return HttpResult.Ok(body: content);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        };
    }

    [HttpPatch, Authorized, BodyValidation, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> UpdateContent([FromBody] ContentDTO dto, [FromRoute] string ticketId)
    {
        try
        {
            var content = await _ctx.Tickets
                    .Where(t => t.Id == ticketId)
                    .Include(t => t.Content)
                    .ThenInclude(c => c.Documents)
                    .Select(t => t.Content)
                    .FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

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
}
