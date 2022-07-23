namespace server.Models
{
    public class Replie
    {
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public User User { get; set; }
    }
}
