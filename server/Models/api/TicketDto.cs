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

    public class DevTicketToUpdateDto
    {
        public int id { get; set;}
        public string status { get; set; } = String.Empty; 
    }
}
