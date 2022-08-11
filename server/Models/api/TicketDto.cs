using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class TicketDto
    {
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectId { get; set; }
        public string Priority { get; set; } = "Medium"; // Low, Medium, High
        public string Type { get; set; } = "Feature"; // Feature, Bug
        public int AssigneeToId { get; set; } 
        public int SubmitterId { get; set; }
    }
}
