namespace server.Models
{
    public class Project
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public Languages[] Languages { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Labels[] Labels { get; set; }
        public User Manger { get; set; }
        public User[] Devolbers { get; set; }
        public User SuperAdmain { get; set; }
        public Comment[] Comments { get; set; }
        public Issue[] Issues { get; set; }
        public Task[] Tasks { get; set; }
        public Report[] Reports { get; set; }
    }
}
