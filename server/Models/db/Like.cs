namespace server.Models.db
{
    public class Like
    {
#pragma warning disable CS8618
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int CommentId { get; set; }
        public Comment Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
