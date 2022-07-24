namespace server.Models.db
{
    public class Ticket
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public bool IsInProgress { get; set; } = false;
        public bool IsCompleted { get; set; } = false;
        public bool IsOpen { get; set; } = false;
        public bool IsNew { get; set; } = true;
        public bool IsBug { get; set; } = false;
        public bool IsFeature { get; set; } = true;
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public User AssigneeTo { get; set; }
        public int AssigneeToId { get; set; }
        public User Submitter { get; set; }
        public int SubmitterId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int LabelId { get; set; }
        public Label Label { get; set; }
        public List<int> CommentsId { get; set; } = new List<int>() { };
        public List<Comment> Comments { get; set; }
    }

}
