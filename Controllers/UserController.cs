using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
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

    public UserController(DataContext ctx, IFirebaseService firebase)
    {
        _ctx = ctx;
        _firebase = firebase;
    }

    public class UpdateAvatar
    {
        public string ImageName { get; set; } = null!;
    };

    [HttpPost("avatar"), Authorized, Validation]
    public async Task<IActionResult> Avatar([FromBody] AvatarDTO dto)
    {
        var userId = (string)(HttpContext.Items["id"])!;

        var contentType = (ContentTypes)Enum.Parse(typeof(ContentTypes), dto.ContentType);

        var user = await _ctx.Users.Where(u => u.Id == userId).Select(u => new UpdateAvatar { ImageName = u.ImageName }).FirstOrDefaultAsync();

        if (user is null) return HttpResult.UnAuthorized(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

        var newImageName = await _firebase.Update(user.ImageName, ContentTypes.webp, Convert.FromBase64String(dto.Data));

        user.ImageName = newImageName;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok("successfully changed profile image", new { imageUrl = Helper.StorageUrl(newImageName) });
    }


    [HttpGet("bio/{userId?}")]
    public async Task<IActionResult> GetBio([FromRoute] string userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { bio = u.Bio })
                        .FirstOrDefaultAsync();

        if (isFound is null) return HttpResult.NotFound();

        return HttpResult.Ok(null, isFound);
    }

    [HttpPost("bio"), Authorized, Validation]
    public async Task<IActionResult> EditBio([FromBody] BioDTO dto)
    {
        var userId = (string)(HttpContext.Items["id"])!;

        var isFound = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

        if (isFound is null) return HttpResult.UnAuthorized(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

        isFound.Bio = dto.Bio;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok("successfully changed bio");
    }

    [HttpPost("profile"), Validation, Authorized]
    public async Task<IActionResult> Profile([FromBody] ContentDTO dto)
    {
        var userId = (string)(HttpContext.Items["id"])!;

        var user = await _ctx.Users
                    .Where(u => u.Id == userId)
                    .Include(u => u.Content)
                    .ThenInclude(c => c.Documents)
                    .Select(u => new { Content = u.Content })
                    .FirstOrDefaultAsync();

        if (user is null) return HttpResult.NotFound("user not found please sing-up", null, "/auth/sing-up");

        for (var i = 0; i < user.Content.Documents.Count; i++)
        {
            var document = user.Content.Documents[i];

            if (!dto.Markdown.Contains(document.Name))
            {
                await _firebase.Delete(document.Name);
                _ctx.Documents.Remove(document);
            }
        }

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentTypes.webp);
                var document = await _ctx.Documents.AddAsync(new Document() { Name = imageName, Id = Ulid.NewUlid().ToString() });
                user.Content.Documents.Add(document.Entity);
                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, Helper.StorageUrl(imageName));
            }
        }

        user.Content.Markdown = dto.Markdown;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok($"successfully changed profile");
    }

    [HttpGet("profile/{userId?}")]
    public async Task<IActionResult> GetProfile([FromRoute] string userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { markdown = u.Content.Markdown })
                        .FirstOrDefaultAsync();

        if (isFound is null) return HttpResult.NotFound();

        return HttpResult.Ok(null, isFound);
    }
}
