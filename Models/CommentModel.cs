using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bug_tracker.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public string Html { get; set; }

        public List<byte[]> images { get; set; }

        [Required]
        [ForeignKey("TicketId")]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }

        [Required]
        [ForeignKey("UserId")]
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
