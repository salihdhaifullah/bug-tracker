using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class ProjectReq
    {
        public string Title { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectMangerId { get; set; }
        public int? Id { get; set; }
    }
}
