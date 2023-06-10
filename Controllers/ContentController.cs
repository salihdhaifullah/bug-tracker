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
    private readonly ILogger<ContentController> _logger;

    public ContentController(DataContext ctx, IFirebaseService firebase, ILogger<ContentController> logger)
    {
        _ctx = ctx;
        _firebase = firebase;
        _logger = logger;
    }

    [HttpPost("{contentId}"), Validation, Authorized]
    public async Task<IActionResult> Content([FromBody] ContentDTO dto, [FromRoute] string contentId)
    {
        try
        {
            var userId = (string)(HttpContext.Items["id"])!;

            var content = await _ctx.Contents
                        .Where(c => c.Id == contentId && c.OwnerId == userId)
                        .Include(c => c.Documents)
                        .FirstOrDefaultAsync();

            if (content is null) return HttpResult.NotFound("content not found");

            for (var i = 0; i < content.Documents.Count; i++)
            {
                var document = content.Documents[i];

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
                    content.Documents.Add(document.Entity);
                    dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, Helper.StorageUrl(imageName));
                }
            }

            content.Markdown = dto.Markdown;

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok($"successfully changed content");
        }
         catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("{contentId}")]
    public async Task<IActionResult> GetContent([FromRoute] string contentId)
    {
        try
        {
            var content = await _ctx.Contents
                        .Where(c => c.Id == contentId)
                        .Select(c => new { markdown = c.Markdown })
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
}
