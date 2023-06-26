using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.DataService;
using Buegee.Services.FirebaseService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("user")]
[Consumes("application/json")]
public class UserController : Controller
{
    private readonly DataContext _ctx;
    private readonly IFirebaseService _firebase;
    private readonly IDataService _data;
    private readonly ILogger<UserController> _logger;

    public UserController(DataContext ctx, IFirebaseService firebase, ILogger<UserController> logger, IDataService data)
    {
        _ctx = ctx;
        _firebase = firebase;
        _logger = logger;
        _data = data;
    }

    [HttpPost("avatar"), Authorized, Validation]
    public async Task<IActionResult> Avatar([FromBody] AvatarDTO dto)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var contentType = (ContentType)Enum.Parse(typeof(ContentType), dto.ContentType);

            var user = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user is null) return HttpResult.UnAuthorized();

            var newImageName = await _firebase.Update(user.ImageName, ContentType.webp, Convert.FromBase64String(dto.Data));

            user.ImageName = newImageName;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully changed profile image", new { imageUrl = Helper.StorageUrl(newImageName) });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpGet("bio/{userId}")]
    public async Task<IActionResult> GetBio([FromRoute] string userId)
    {
        try
        {
            var isFound = await _ctx.Users
                            .Where(u => u.Id == userId)
                            .Select(u => new { bio = u.Bio })
                            .FirstOrDefaultAsync();

            if (isFound is null) return HttpResult.NotFound();

            return HttpResult.Ok(null, isFound);

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("bio"), Authorized, Validation]
    public async Task<IActionResult> EditBio([FromBody] BioDTO dto)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var isFound = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (isFound is null) return HttpResult.UnAuthorized();

            isFound.Bio = dto.Bio;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully changed bio");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost("profile"), Authorized, Validation]
    public async Task<IActionResult> Profile([FromBody] ContentDTO dto)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var profile = await _ctx.Users
                    .Where(u => u.Id == userId)
                    .Include(u => u.Content)
                    .ThenInclude(c => c.Documents)
                    .Select(u => u.Content)
                    .FirstOrDefaultAsync();

            if (profile is null) return HttpResult.UnAuthorized();

            await _data.EditContent(dto, profile, _ctx);

            return HttpResult.Ok("successfully changed profile");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("profile/{userId}")]
    public async Task<IActionResult> GetProfile([FromRoute] string userId)
    {
        try
        {
            var content = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { markdown = u.Content.Markdown })
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

    [HttpGet("users-to-invent/{projectId}"), Authorized]
    public async Task<IActionResult> SearchUser([FromQuery] string email, [FromRoute] string projectId)
    {
        try
        {
            var users = await _ctx.Users
                        .Where(u => EF.Functions.ILike(u.Email, $"{email}%") && !u.MemberShips.Any(m => m.ProjectId == projectId && m.IsJoined))
                        .OrderBy((u) => u.CreatedAt)
                        .Select(u => new {
                            imageUrl = Helper.StorageUrl(u.ImageName),
                            email = u.Email,
                            fullName = $"{u.FirstName} {u.LastName}",
                            id = u.Id,
                         })
                        .Take(10)
                        .ToListAsync();

            return HttpResult.Ok(body: users);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
