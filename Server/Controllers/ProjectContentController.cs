using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/content")]
[ApiController]
public class ProjectContentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly ILogger<ProjectContentController> _logger;


    public ProjectContentController(DataContext ctx, ILogger<ProjectContentController> logger, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
    }

    [HttpGet, ProjectRead]
    public async Task<IActionResult> GetContent([FromRoute] string projectId)
    {
        try
        {
            var content = await _ctx.Projects
                        .Where(p => p.Id == projectId)
                        .Select(p => new { markdown = p.Content.Markdown })
                        .FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

            return HttpResult.Ok(body: content);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        };
    }

    [HttpPatch, Authorized, BodyValidation, ProjectRole(Role.owner)]
    public async Task<IActionResult> UpdateContent([FromBody] ContentDTO dto, [FromRoute] string projectId)
    {
        try
        {
            var content = await _ctx.Projects
                    .Where(p => p.Id == projectId)
                    .Include(p => p.Content)
                    .ThenInclude(c => c.Documents)
                    .Select(p => p.Content)
                    .FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

            await _data.EditContent(dto, content, _ctx);

            await _ctx.SaveChangesAsync();
            return HttpResult.Ok("successfully updated content");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
