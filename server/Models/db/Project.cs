namespace server.Models.db
{
    public class Project
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public User Manger { get; set; }
        public User[]? Developers { get; set; }
        public User[]? Submitter { get; set; }
        public User[]? Tester { get; set; }
        public User SuperAdmin { get; set; }
        public Comment[] Comments { get; set; }
        public Issue[]? Issues { get; set; }
        public Task[]? Tasks { get; set; }
        public Report[]? Reports { get; set; }
    }
}
