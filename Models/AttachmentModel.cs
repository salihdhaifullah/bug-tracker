using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bug_tracker.Models
{
    public class Attachment
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; }
        public byte[] File { get; set; }

        [Required]
        [ForeignKey("TicketId")]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
    }
}
