namespace server.Models.db
{
    public class Replie
    {
#pragma warning disable CS8618
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int PostId { get; set; } // <= need work on this
    }
}
