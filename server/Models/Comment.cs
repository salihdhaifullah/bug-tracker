namespace server.Models
{
    public class Comments
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Like[]? Likes { get; set; }
        public Replie[]? Replies { get; set; }
        public int[]? imagesId { get; set; }
    }
}
