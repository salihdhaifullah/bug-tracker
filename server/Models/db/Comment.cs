namespace server.Models.db
{
    public class Comment
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public int UserId { get; set; } 
        public User User { get; set; }
        public Ticket Ticket { get; set; }
        public int TicketId { get; set; } 
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
