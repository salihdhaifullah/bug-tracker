using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;

namespace Buegee.Services.DataService;

public interface IDataService {
    public Task EditContent(ContentDTO dto, Content content, DataContext ctx);
}
