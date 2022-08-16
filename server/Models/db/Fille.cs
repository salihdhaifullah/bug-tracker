using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.db
{
    public class Fille
    {
         #pragma warning disable CS8618
        public int Id { get; set; }
        public string type { get; set; } = "Image";
        public string name { get; set; } = String.Empty;
        public string Url { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        [ForeignKey("TicketId")]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required, ForeignKey("CreatorId")]
        public int CreatorId { get; set; }
        public virtual User Creator { get; set; }
    }
}
