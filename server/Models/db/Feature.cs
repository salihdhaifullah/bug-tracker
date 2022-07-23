namespace server.Models.db
{
    public class Feature
    {
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
        public int[]? CommentsId { get; set; }
        public Comment[]? Comments { get; set; }
    }
}
