using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("comment")]
public class Comment
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Ticket"), Column("ticket")]
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content")]
    public int ContentId { get; set; }
    public Content Content { get; set; } = null!;

    [Required, ForeignKey("Commenter"), Column("commenter")]
    public int CommenterId { get; set; }
    public User Commenter { get; set; } = null!;
}
