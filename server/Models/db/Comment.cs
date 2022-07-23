namespace server.Models.db
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public int UserId { get; set; }
        public User User { get; set; }
        public int tactId { get; set; } /// <= need work on this
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int[] LikesId { get; set; }
        public Like[]? Likes { get; set; }
        public int[]? RepliesId { get; set; }
        public Replie[]? Replies { get; set; }
    }
}
