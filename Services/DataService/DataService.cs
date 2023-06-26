using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.FirebaseService;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Buegee.Models;

namespace Buegee.Services.DataService;

public class DataService : IDataService {
    private readonly IFirebaseService _firebase;

    public DataService(IFirebaseService firebase) {
        _firebase = firebase;
    }

    public async Task EditContent(ContentDTO dto, Content content, DataContext ctx) {

            for (var i = 0; i < content.Documents.Count; i++)
            {
                var document = content.Documents[i];

                if (!dto.Markdown.Contains(document.Name))
                {
                    await _firebase.Delete(document.Name);
                    ctx.Documents.Remove(document);
                }
            }

            for (var i = 0; i < dto.Files.Count; i++)
            {
                var file = dto.Files[i];

                if (dto.Markdown.Contains(file.PreviewUrl))
                {
                    var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentType.webp);
                    var document = await ctx.Documents.AddAsync(new Document() { Name = imageName, Id = Ulid.NewUlid().ToString() });
                    content.Documents.Add(document.Entity);
                    dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, Helper.StorageUrl(imageName));
                }
            }

            content.Markdown = dto.Markdown;

            await ctx.SaveChangesAsync();
    }
}
