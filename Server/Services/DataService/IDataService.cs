using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Buegee.Services.DataService;

public interface IDataService {
    public Task EditContent(ContentDTO dto, Content content, DataContext ctx);
    public Task<EntityEntry<Content>> CreateContent(ContentDTO dto, string userId, DataContext ctx);
    public Task AddActivity(string projectId, string markdown, DataContext ctx);
}
