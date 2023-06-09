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

[ApiRoute("content")]
[Consumes("application/json")]
public class ContentController : Controller
{
    private readonly DataContext _ctx;
    private readonly IFirebaseService _firebase;

    public ContentController(DataContext ctx, IFirebaseService firebase)
    {
        _ctx = ctx;
        _firebase = firebase;
    }

    private class userContent
    {
        public Content Content { get; set; } = null!;
        public List<Document> Documents { get; set; } = null!;
    }

    [HttpPost("{contentId}"), Validation, Authorized]
    public async Task<IActionResult> Content([FromBody] ContentDTO dto)
    {
        var userId = (string)(HttpContext.Items["id"])!;

        var user = await _ctx.Users
                    .Where(u => u.Id == userId)
                    .Select(u => new userContent() { Content = u.Content, Documents = u.Content.Documents })
                    .FirstOrDefaultAsync();
            // TODO you need to decentralize Content Management


        if (user is null) return HttpResult.NotFound("user not found please sing-up", null, "/auth/sing-up");

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {

                var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentTypes.webp);

                var document = await _ctx.Documents.AddAsync(new Document() { Name = imageName, Id = Ulid.NewUlid().ToString() });

                // TODO Check if it will work or not
                // await _ctx.SaveChangesAsync();

                user.Documents.Add(document.Entity);

                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, Helper.StorageUrl(imageName));
            }
        }

        await _ctx.SaveChangesAsync();

        for (var i = 0; i < user.Documents.Count; i++)
        {
            var document = user.Documents[i];

            if (!dto.Markdown.Contains(document.Name))
            {
                await _firebase.Delete(document.Name);
                _ctx.Documents.Remove(document);
            }
        }

        user.Content.Markdown = dto.Markdown;

        await _ctx.SaveChangesAsync();

        return HttpResult.Ok($"successfully changed profile");
    }
}
