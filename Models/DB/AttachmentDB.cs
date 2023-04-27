using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models.DB;

public class AttachmentDB
{
    [Key]
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public byte[] File { get; set; } = null!;
    [Required]
    [ForeignKey("TicketId")]
    public int TicketId { get; set; }
    public virtual TicketDB Ticket { get; set; } = null!;
}
