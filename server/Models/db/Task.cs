namespace server.Models.db
{
    public class Task
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty; 
        public string Description { get; set; } = String.Empty;
        public bool IsInProgress { get; set; } = true;
        public bool IsCompleted { get; set; } = false;
        public User AssigneeTo { get; set; }
        public int AssigneeToId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int LabelId { get; set; }
        public Label Label { get; set; }
        public int[]? CommentsId { get; set; } = Array.Empty<int>();
        public Comment[]? Comments { get; set; }
    }
}
