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
        public bool IsClosed { get; set; } = false;
        public  DateTime? ClosedAt{ get; set; }
        public User Manger { get; set; } // can do anything  
        public int MangerId { get; set; }  
        public User[]? Developers { get; set; } // can change status of task that he assigned to 
        public int[]? DevelopersId { get; set; }
        public User[]? Tester { get; set; } // can change status of all tasks that not closed and can closed task 
        public int[]? TesterId { get; set; } 
        public Comment[]? Comments { get; set; }
        public int[]? CommentsId { get; set; }
        public Issue[]? Issues { get; set; }
        public int[]? IssuesId { get; set; }
        public Task[]? Tasks { get; set; }
        public int[]? TasksId { get; set; }
        public Feature[]? Features { get; set; }
        public int[]? FeaturesId { get; set; }
    }
}
