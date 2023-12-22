using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.FirebaseService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IFirebaseService _firebase;
    private readonly IAuthService _auth;
    private readonly ILogger<UserController> _logger;


    public UserController(DataContext ctx, IFirebaseService firebase, IAuthService auth, ILogger<UserController> logger)
    {
        _ctx = ctx;
        _auth = auth;
        _firebase = firebase;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetUser(string userId)
    {
        try
        {
            var user = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new
                        {
                            bio = u.Bio,
                            name = $"{u.FirstName} {u.LastName}",
                            avatarUrl = u.AvatarUrl,
                            contentId = u.ContentId
                        })
                        .FirstOrDefaultAsync();

            if (user is null) return HttpResult.NotFound("page not found");

            return HttpResult.Ok(body: user);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch("avatar"), Authorized, BodyValidation]
    public async Task<IActionResult> UpdateAvatar([FromBody] AvatarDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var contentType = (ContentType)Enum.Parse(typeof(ContentType), dto.ContentType);

            var user = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user is null) return HttpResult.UnAuthorized();

            var newAvatarUrl = await _firebase.Update(user.AvatarUrl, ContentType.webp.ToString(), Convert.FromBase64String(dto.Data));

            user.AvatarUrl = newAvatarUrl;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully updated profile image", new { avatarUrl = newAvatarUrl });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpPatch("bio"), Authorized, BodyValidation]
    public async Task<IActionResult> UpdateBio([FromBody] BioDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var user = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user is null) return HttpResult.UnAuthorized();

            user.Bio = dto.Bio;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully updated bio");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
