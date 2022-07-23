namespace server.Models
{
    public class Task
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty; 
        public string Description { get; set; } = String.Empty;
        public string Status { get; set; } = String.Empty;
        public string Priority { get; set; } = String.Empty;
        public User Assignee { get; set; }
        public User Creator { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int ProjectId { get; set; }
        public string Label { get; set; } = String.Empty;
        public Comment[] Comments { get; set; }
    }
}
