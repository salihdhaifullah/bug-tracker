using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.FirebaseService;
using Buegee.Utils.Enums;
using Buegee.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Buegee.Services.DataService;

public class DataService : IDataService
{
    private readonly IFirebaseService _firebase;

    public DataService(IFirebaseService firebase)
    {
        _firebase = firebase;
    }

    public async Task EditContent(ContentDTO dto, Content content, DataContext ctx)
    {

        for (var i = 0; i < content.Documents.Count; i++)
        {
            var document = content.Documents[i];

            if (!dto.Markdown.Contains(document.Url))
            {
                await _firebase.Delete(document.Url);
                ctx.Documents.Remove(document);
            }
        }

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentType.webp.ToString());
                await ctx.Documents.AddAsync(new Document() { Url = imageName, Id = Ulid.NewUlid().ToString(), ContentId = content.Id });
                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, imageName);
            }
        }

        content.Markdown = dto.Markdown;
    }

    public async Task<EntityEntry<Content>> CreateContent(ContentDTO dto, string userId, DataContext ctx)
    {
        var content = await ctx.Contents.AddAsync(new Content() { Id = Ulid.NewUlid().ToString(), UserId = userId });

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentType.webp.ToString());
                await ctx.Documents.AddAsync(new Document() { Url = imageName, Id = Ulid.NewUlid().ToString(), ContentId = content.Entity.Id });
                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, imageName);
            }
        }

        content.Entity.Markdown = dto.Markdown;

        return content;
    }

    public async Task AddActivity(string projectId, string markdown, DataContext ctx)
    {
        var activityId = Ulid.NewUlid().ToString();
        var activity = new Activity() { Id = activityId, ProjectId = projectId, Content = markdown };
        await ctx.Activities.AddAsync(activity);
    }
}
