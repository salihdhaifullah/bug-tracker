namespace server.Models
{
    public class Report
    {
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string Image { get; set; } = String.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = String.Empty;
        public string UserEmail { get; set; } = String.Empty;
        public string UserRole { get; set; } = String.Empty;

    }
}
