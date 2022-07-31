using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class TicketReq
    {
        [Required]
        public string Name { get; set; } = String.Empty;
        [Required]
        public string Description { get; set; } = String.Empty;
        [Required]
        public int ProjectId { get; set; }
        public bool IsBug { get; set; } 
        public bool IsFeature { get; set; }
        public int AssigneeToId { get; set; } 
        public int SubmitterId { get; set; }
    }
}
