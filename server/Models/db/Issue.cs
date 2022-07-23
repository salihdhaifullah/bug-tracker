namespace server.Models.db
{
    public class Issue
    {
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public bool isAssignee  { get; set; }
        public bool IsInProgress { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int LabelId { get; set; }
        public Labels Label { get; set; }
        public int AssigneeToId { get; set; }
        public User AssigneeTo { get; set; }
        public int ReporterId { get; set; }
        public User Reporter { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsClosed { get; set; }
    }
}