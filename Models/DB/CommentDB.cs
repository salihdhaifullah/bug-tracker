using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models.DB;

public class CommentDB
{
    [Key]
    public int Id { get; set; }
    public string Html { get; set; } = null!;
    public List<byte[]> images { get; set; } = null!;
    [Required]
    [ForeignKey("TicketId")]
    public int TicketId { get; set; }
    public virtual TicketDB Ticket { get; set; } = null!;
    [Required]
    [ForeignKey("UserId")]
    public int UserId { get; set; }
    public virtual UserDB User { get; set; } = null!;
}
