using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("attachment")]
public class Attachment
{
    [Key, Column("id"), StringLength(26)]
    public required string Id { get; set; } = null!;

    [Required, Column("url")]
    public required string Url { get; set; } = null!;

    [Required, Column("title")]
    public required string Title { get; set; } = null!;

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Ticket"), Column("ticket_id"), StringLength(26)]
    public required string TicketId { get; set; } = null!;
    public Ticket Ticket { get; set; } = null!;
}

