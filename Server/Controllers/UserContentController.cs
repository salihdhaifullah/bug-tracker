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
[ApiRoute("users/{userId}/content")]
[ApiController]
public class UserContentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IDataService _data;
    private readonly IAuthService _auth;
    private readonly ILogger<UserContentController> _logger;


    public UserContentController(DataContext ctx, ILogger<UserContentController> logger, IAuthService auth, IDataService data)
    {
        _ctx = ctx;
        _logger = logger;
        _data = data;
        _auth = auth;
    }

    [HttpGet]
    public async Task<IActionResult> GetContent([FromRoute] string userId)
    {
        try
        {
            var content = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { markdown = u.Content.Markdown })
                        .FirstOrDefaultAsync();

            return HttpResult.Ok(body: content);
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        };
    }

    [HttpPatch, Authorized, BodyValidation]
    public async Task<IActionResult> UpdateContent([FromBody] ContentDTO dto, [FromRoute] string userId)
    {
        try
        {
            if (_auth.GetId(Request) != userId) return HttpResult.Forbidden("you can not edit this content");

            var content = await _ctx.Users
                    .Where(u => u.Id == userId)
                    .Include(u => u.Content)
                    .ThenInclude(c => c.Documents)
                    .Select(u => u.Content)
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
