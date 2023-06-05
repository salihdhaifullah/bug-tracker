using System.Text.Json;
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
    private readonly ILogger<UserController> _logger;

    public UserController(DataContext ctx, IAuthService auth, IFirebaseService firebase, ILogger<UserController> logger)
    {
        _auth = auth;
        _ctx = ctx;
        _firebase = firebase;
        _logger = logger;
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

    private class userContent
    {
        public int ContentId { get; set; }
        public Content Content { get; set; } = null!;
        public List<ContentUrl> ContentUrls { get; set; } = null!;
    }



    [HttpPost("profile")]
    public async Task<IActionResult> Profile([FromBody] ProfileContentDTO dto)
    {
        _logger.LogWarning("\n\n\n\\n\n\n\n start start start \n\n\n\n\n\n\n\n");
        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var user = await _ctx.Users
                    .Where(u => u.Id == userId)
                    .Select(u => new userContent() { ContentId = u.ContentId, Content = u.Content, ContentUrls = u.Content.ContentUrls })
                    .FirstOrDefaultAsync();


        if (user is null) return NotFoundResult("user not found please sing-up", null, "/auth/sing-up");

        _logger.LogWarning($"user is {JsonSerializer.Serialize(new
        {
            ContentId = user.ContentId,
            ContentUrls = user.ContentUrls.Select(c => c.Url),
            Markdown = user.Content.Markdown,
            ContentIdIn = user.Content.Id,
        }, options)}");

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];


            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var image = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentTypes.webp);

                _logger.LogWarning($"\n\n\n uploaded new image image ur {image.url} image name {image.name}\n\n\n ");

                var svvsv = await _ctx.ContentUrls.AddAsync(new ContentUrl() { Url = image.url, Name = image.name, ContentId = user.ContentId });

                await _ctx.SaveChangesAsync();

                user.ContentUrls.Add(svvsv.Entity);

                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, image.url);
            }
            else
            {
                _logger.LogWarning($"\n\n\n file previewUrl is {file.PreviewUrl} and its not in the markdown {dto.Markdown} so it will not be add \n\n\n ");

            }
        }

        await _ctx.SaveChangesAsync();

        _logger.LogWarning($"user is {JsonSerializer.Serialize(new
        {
            ContentId = user.ContentId,
            ContentUrls = user.ContentUrls.Select(c => c.Url),
            Markdown = user.Content.Markdown,
            ContentIdIn = user.Content.Id,
        }, options)}");

        _logger.LogWarning($"\n\n\n dto Markdown is \"{dto.Markdown}\"\n\n\n");

        for (var i = 0; i < user.ContentUrls.Count; i++)
        {
            var contentUrl = user.ContentUrls[i];

            _logger.LogWarning($"\n\n\n user content url is \"{contentUrl.Url}\"\n\n\n");
            _logger.LogWarning($"\n\n\n is Markdown Contains contentUrl Url \"{dto.Markdown.Contains(contentUrl.Url)}\"\n\n\n");
            _logger.LogWarning($"\n\n\n contentUrl Name \"{contentUrl.Name}\"\n\n\n");

            if (!dto.Markdown.Contains(contentUrl.Url))
            {
                _logger.LogWarning($"\n\n\n removing this contentUrl Name {contentUrl.Name}\n\n\n");

                await _firebase.Delete(contentUrl.Name);
                _ctx.ContentUrls.Remove(contentUrl);
            }
        }

        user.Content.Markdown = dto.Markdown;

        await _ctx.SaveChangesAsync();

        _logger.LogWarning($"\n\n\n user is {JsonSerializer.Serialize(new
        {
            ContentId = user.ContentId,
            ContentUrls = user.ContentUrls.Select(c => c.Url),
            Markdown = user.Content.Markdown,
            ContentIdIn = user.Content.Id,
        }, options)}\n\n\n");

        _logger.LogWarning("\n\n\n\\n\n\n\n end end end \n\n\n\n\n\n\n\n");

        return OkResult($"successfully changed profile");
    }

    [HttpGet("profile/{userId?}")]
    public async Task<IActionResult> GetProfile([FromRoute] int userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { markdown = u.Content.Markdown })
                        .FirstOrDefaultAsync();

        if (isFound is null) return NotFoundResult();

        return OkResult(null, isFound);
    }
}
