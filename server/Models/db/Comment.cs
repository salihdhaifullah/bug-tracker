using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.db
{
    public class Comment
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        [Required, ForeignKey("UserId")]
        public int UserId { get; set; } 
        public virtual User User { get; set; }
        [Required, ForeignKey("TicketId")]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
