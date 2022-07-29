namespace server.Models.db
{
    public class Organization
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string? Logo { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<Project>? Projects { get; set; } 
        public List<int> ProjectsId { get; set; } = new List<int>() { };
        public List<User>? Employs { get; set; }
        public List<int> EmploysId { get; set; } = new List<int>() { };
        public User Adman { get; set; } 
        public int AdmanId { get; set; }
    }
}