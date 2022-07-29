using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class ProjectReq
    {
        [Required]
        public string Title { get; set; } = String.Empty;
        [Required]
        public string Name { get; set; } = String.Empty;
        [Required]
        public string Description { get; set; } = String.Empty;
        [Required]
        public int MangerId { get; set; }
        public List<int> DevelopersIds { get; set; } = new List<int>() { };
        public int? Id { get; set; }
    }
}
