namespace server.Models.db
{
    public class Report
    {
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
