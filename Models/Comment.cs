using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("comment")]
public class Comment
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Ticket"), Column("ticket_id")]
    public int TicketId { get; set; }
    public virtual Ticket Ticket { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id")]
    public int ContentId { get; set; }
    public virtual Content Content { get; set; } = null!;

    [Required, ForeignKey("Commenter"), Column("commenter_id")]
    public int CommenterId { get; set; }
    public virtual User Commenter { get; set; } = null!;
}
