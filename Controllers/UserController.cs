using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Services.FirebaseService;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Buegee.Utils.Utils;

namespace Buegee.Controllers;

[ApiRoute("user")]
[Consumes("application/json")]
public class UserController : Controller
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly IFirebaseService _firebase;

    public UserController(DataContext ctx, IAuthService auth, IFirebaseService firebase)
    {
        _auth = auth;
        _ctx = ctx;
        _firebase = firebase;
    }

    [HttpPost("upload-profile")]
    public async Task<IActionResult> UploadProfile([FromBody] UploadProfileDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var contentType = (ContentTypes)Enum.Parse(typeof(ContentTypes), dto.ContentType);

        var url = await _ctx.Users.Where(u => u.Id == userId).Select(u => u.ImageUrl).FirstOrDefaultAsync();

        if (url is null) return NotFoundResult(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

        await _firebase.Update(url, Convert.FromBase64String(dto.Data));

        return OkResult("successfully changed profile image");
    }


    [HttpGet("title/{userId?}")]
    public async Task<IActionResult> GetTitle([FromRoute] int userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { bio = u.Bio })
                        .FirstOrDefaultAsync();

        if (isFound is null) return NotFoundResult();

        return OkResult(null, isFound);
    }

    [HttpPost("bio")]
    public async Task<IActionResult> UpdateBio([FromBody] BioDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var isFound = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

        if (isFound is null) return NotFoundResult("user not found please sing-up", null, "/auth/sing-up");

        isFound.Bio = dto.Bio;

        await _ctx.SaveChangesAsync();

        return OkResult("successfully changed bio");
    }

    [HttpPost("profile")]
    public async Task<IActionResult> Profile([FromBody] ProfileContentDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var user = await _ctx.Users
                    .Include(u => u.Content)
                    .ThenInclude(c => c != null ? c.ContentUrls : null)
                    .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null) return NotFoundResult("user not found please sing-up", null, "/auth/sing-up");

        if (user.Content is null || user.ContentId is null)
        {
            user.Content = new Content() { Markdown = dto.Markdown };
            await _ctx.Contents.AddAsync(user.Content);
        }

        var contentUrls = new List<ContentUrl>();

        foreach (var file in dto.Files)
        {
            var url = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentTypes.webp);

            contentUrls.Add(new ContentUrl() { Url = url, ContentId = (int)user.ContentId });

            dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, url);
        }

        await _ctx.ContentUrls.AddRangeAsync(contentUrls);

        // Delete unused content urls and files
        foreach (var contentUrl in user.Content.ContentUrls)
        {
            if (!dto.Markdown.Contains(contentUrl.Url))
            {
                await _firebase.Delete(contentUrl.Url);
                _ctx.ContentUrls.Remove(contentUrl);
            }
        }

        user.Content.Markdown = dto.Markdown;

        await _ctx.SaveChangesAsync();

        return OkResult($"successfully changed profile for user {userId}");

    }

    [HttpGet("profile/{userId?}")]
    public async Task<IActionResult> GetProfile([FromRoute] int userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { markdown = u.Content != null ? u.Content.Markdown : "" })
                        .FirstOrDefaultAsync();

        if (isFound is null) return NotFoundResult();

        return OkResult(null, isFound);
    }
}
