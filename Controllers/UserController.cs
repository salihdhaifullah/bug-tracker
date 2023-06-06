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

    [HttpPost("avatar"), Authorized, Validation]
    public async Task<IActionResult> Avatar([FromBody] AvatarDTO dto)
    {
        var userId = (int)(HttpContext.Items["userId"])!;

        var contentType = (ContentTypes)Enum.Parse(typeof(ContentTypes), dto.ContentType);

        var ImageName = await _ctx.Users.Where(u => u.Id == userId).Select(u => u.Image.Name).FirstOrDefaultAsync();

        if (String.IsNullOrEmpty(ImageName)) return HttpResult.UnAuthorized(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

        await _firebase.Update(ImageName, Convert.FromBase64String(dto.Data));

        return HttpResult.Ok("successfully changed profile image");
    }


    [HttpGet("bio/{userId?}")]
    public async Task<IActionResult> GetBio([FromRoute] int userId)
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
        var userId = (int)(HttpContext.Items["userId"])!;

        var isFound = await _ctx.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

        if (isFound is null) return HttpResult.UnAuthorized(massage: "your account not found please sing-up to continue", redirectTo: "/auth/sing-up");

        isFound.Bio = dto.Bio;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok("successfully changed bio");
    }

    private class userContent
    {
        public Content Content { get; set; } = null!;
        public List<Document> Documents { get; set; } = null!;
    }

    [HttpPost("profile"), Validation, Authorized]
    public async Task<IActionResult> Profile([FromBody] ProfileContentDTO dto)
    {
        var userId = (int)(HttpContext.Items["userId"])!;

        var user = await _ctx.Users
                    .Where(u => u.Id == userId)
                    .Select(u => new userContent() { Content = u.Content, Documents = u.Content.Documents })
                    .FirstOrDefaultAsync();


        if (user is null) return HttpResult.NotFound("user not found please sing-up", null, "/auth/sing-up");

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var image = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentTypes.webp);

                var document = await _ctx.Documents.AddAsync(new Document() { Url = image.url, Name = image.name });

                await _ctx.SaveChangesAsync();

                user.Documents.Add(document.Entity);

                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, image.url);
            }
        }

        await _ctx.SaveChangesAsync();

        for (var i = 0; i < user.Documents.Count; i++)
        {
            var contentUrl = user.Documents[i];

            if (!dto.Markdown.Contains(contentUrl.Url))
            {
                await _firebase.Delete(contentUrl.Name);
                _ctx.Documents.Remove(contentUrl);
            }
        }

        user.Content.Markdown = dto.Markdown;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok($"successfully changed profile");
    }

    [HttpGet("profile/{userId?}")]
    public async Task<IActionResult> GetProfile([FromRoute] int userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { markdown = u.Content.Markdown })
                        .FirstOrDefaultAsync();

        if (isFound is null) return HttpResult.NotFound();

        return HttpResult.Ok(null, isFound);
    }
}
