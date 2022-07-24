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
        public DateTime? ClosedAt { get; set; }
        public User Manger { get; set; } // can do anything  
        public int MangerId { get; set; }
        public User Admin { get; set; } // can do anything  
        public int AdminId { get; set; }
        public List<User> Submitters { get; set; }
        public List<int> SubmittersId { get; set; } = new List<int>() { };
        public List<User> Developers { get; set; } // can change status of task that he assigned to 
        public List<int> DevelopersId { get; set; } = new List<int>() { };
        public List<Ticket> Tickets { get; set; }
        public List<int> TicketsId { get; set; } = new List<int>() { };
    }
}
