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
[ApiRoute("contents/{contentId}")]
[ApiController]
public class ContentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<ContentController> _logger;


    public ContentController(DataContext ctx, ILogger<ContentController> logger, IAuthService auth, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpGet]
    public async Task<IActionResult> GetContent([FromRoute] string contentId)
    {
        try
        {
            var content = await _ctx.Contents
                        .Where(c => c.Id == contentId)
                        .Select(c => new { markdown = c.Markdown })
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

    [HttpPatch, Authorized, BodyValidation]
    public async Task<IActionResult> UpdateContent([FromBody] ContentDTO dto, [FromRoute] string contentId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var content = await _ctx.Contents
                    .Where(c => c.Id == contentId && c.UserId == userId)
                    .Include(c => c.Documents)
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
}
