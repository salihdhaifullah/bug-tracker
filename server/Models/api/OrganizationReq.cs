using server.Models.db;

namespace server.Models.api
{
    public class OrganizationReq : Organization
    {
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string? Logo { get; set; } = String.Empty;
        public int AdmanId { get; set; }
    }
}