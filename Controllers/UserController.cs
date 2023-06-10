using Buegee.Data;
using Buegee.DTO;
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
    private readonly ILogger<UserController> _logger;

    public UserController(DataContext ctx, IFirebaseService firebase, ILogger<UserController> logger)
    {
        _ctx = ctx;
        _firebase = firebase;
        _logger = logger;
    }

    [HttpPost("avatar"), Authorized, Validation]
    public async Task<IActionResult> Avatar([FromBody] AvatarDTO dto)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var contentType = (ContentTypes)Enum.Parse(typeof(ContentTypes), dto.ContentType);

            var user = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user is null) return HttpResult.UnAuthorized(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

            var newImageName = await _firebase.Update(user.ImageName, ContentTypes.webp, Convert.FromBase64String(dto.Data));

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


    [HttpGet("bio/{userId?}")]
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

            if (isFound is null) return HttpResult.UnAuthorized(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

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

}
