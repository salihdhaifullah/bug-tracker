using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/{ticketId}/comments/{commentId}/content")]
[ApiController]
public class CommentContentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<CommentContentController> _logger;

    public CommentContentController(DataContext ctx, ILogger<CommentContentController> logger, IAuthService auth, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpGet, ProjectRead]
    public async Task<IActionResult> GetContent([FromRoute] string commentId)
    {
        try
        {
            var content = await _ctx.Comments
                        .Where(c => c.Id == commentId)
                        .Select(c => new { markdown = c.Content.Markdown })
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

    [HttpPatch, Authorized, BodyValidation]
    public async Task<IActionResult> UpdateContent([FromBody] ContentDTO dto, [FromRoute] string commentId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var content = await _ctx.Comments
                    .Where(c => c.Id == commentId && c.CommenterId == userId)
                    .Include(c => c.Content)
                    .ThenInclude(c => c.Documents)
                    .Select(c => c.Content)
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
