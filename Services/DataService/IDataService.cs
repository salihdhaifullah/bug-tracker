using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Utils.Enums;

namespace Buegee.Services.DataService;

public interface IDataService {
    public Task EditContent(ContentDTO dto, Content content, DataContext ctx);
    public Task JoinProjectActivity(string projectId, string userName, DataContext ctx);
    public Task CreateProjectActivity(string projectId, string projectName, DataContext ctx);
    public Task CreateTicketActivity(string projectId, string ticketName, TicketType TicketType, Status status, string? assignedToName, Priority Priority,  DataContext ctx);
}
