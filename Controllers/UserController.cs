using System.Collections.ObjectModel;
using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Utils;
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

    public UserController(DataContext ctx, IAuthService auth)
    {
        _auth = auth;
        _ctx = ctx;
    }

    [HttpPost("upload-profile")]
    public async Task<IActionResult> UploadProfile([FromBody] UploadProfileDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        ContentTypes contentType = (ContentTypes)Enum.Parse(typeof(ContentTypes), dto.ContentType);

        var isFound = _ctx.Users.Include(u => u.Image).FirstOrDefault(u => u.Id == userId);

        if (isFound is null) return new HttpResult().IsOk(false).StatusCode(404).Message("user not found please sing-up").RedirectTo("/auth/sing-up").Get();

        isFound.Image.ContentType = contentType;
        isFound.Image.Data = Convert.FromBase64String(dto.Data);

        await _ctx.SaveChangesAsync();

        return new HttpResult().IsOk(true).Message("successfully changed profile image").Get();
    }


    [HttpGet("title/{userId?}")]
    public async Task<IActionResult> GetTitle([FromRoute] int userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId)
                        .Select(u => new { title = u.Title })
                        .FirstOrDefaultAsync();

        if (isFound is null) return new HttpResult().IsOk(false).StatusCode(404).Get();

        return new HttpResult().IsOk(true).Body(isFound).StatusCode(200).Get();
    }

    [HttpPost("title")]
    public async Task<IActionResult> UpdateTitle([FromBody] TitleDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var isFound = _ctx.Users.FirstOrDefault(u => u.Id == userId);

        if (isFound is null) return new HttpResult().IsOk(false).StatusCode(404).Message("user not found please sing-up").RedirectTo("/auth/sing-up").Get();

        isFound.Title = dto.Title;

        await _ctx.SaveChangesAsync();

        return new HttpResult().IsOk(true).Message("successfully changed bio").Get();
    }

    [HttpPost("profile")]
    public async Task<IActionResult> Profile([FromBody] ProfileContentDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        var isFound = _ctx.Users.FirstOrDefault(u => u.Id == userId);

        if (isFound is null) return new HttpResult().IsOk(false).StatusCode(404).Message("user not found please sing-up").RedirectTo("/auth/sing-up").Get();

        var profile = isFound.Profile;

        if (profile is not null)
        {
            foreach (var file in profile.Files)
            {
                _ctx.Files.Remove(file);
            }
        }
        else
        {
            profile = new Content();
            if (profile.Files is null) profile.Files = new Collection<Document>();
        }

        foreach (var f in dto.Files)
        {
            var file = await _ctx.Files.AddAsync(new Document()
            {
                ContentType = ContentTypes.webp,
                Data = Convert.FromBase64String(f.Base64),
                IsPrivate = false
            });

            dto.Markdown = dto.Markdown.Replace(f.PreviewUrl, $"/api/files/public/{file.Entity.Id}");
            profile.Files.Add(file.Entity);
        }

        profile.Markdown = dto.Markdown;

        isFound.Profile = profile;
        isFound.ProfileId = profile.Id;

        await _ctx.SaveChangesAsync();

        return new HttpResult().IsOk(true).Message("successfully changed profile").Get();
    }

    [HttpGet("profile/{userId?}")]
    public async Task<IActionResult> GetProfile([FromRoute] int userId)
    {

        var isFound = await _ctx.Users
                        .Where(u => u.Id == userId && u.Profile != null)
                        .Select(u => new { markdown = u.Profile!.Markdown })
                        .FirstOrDefaultAsync();

        if (isFound is null) return new HttpResult().IsOk(false).StatusCode(404).Get();

        return new HttpResult().IsOk(true).Body(isFound).StatusCode(200).Get();
    }

}
