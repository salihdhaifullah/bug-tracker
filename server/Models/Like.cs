namespace server.Models
{
    public class Like
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CommentId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
