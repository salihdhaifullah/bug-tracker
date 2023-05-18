using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Utils.Enums;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("ticket")]
[Index(nameof(Title))]
[Index(nameof(Type))]
[Index(nameof(Priority))]
[Index(nameof(Status))]
public class Ticket
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("title"), StringLength(100)]
    public string Title { get; set; } = null!;

    [ForeignKey("Description"), Column("description")]
    public int? DescriptionId { get; set; }
    public Content? Description { get; set; }

    [Column("type"), EnumDataType(typeof(TicketType))]
    public TicketType Type { get; set; } = TicketType.bug;

    [Column("priority"), EnumDataType(typeof(TicketPriority))]
    public TicketPriority Priority { get; set; } = TicketPriority.medium;

    [Column("status"), EnumDataType(typeof(TicketStatus))]
    public TicketStatus Status { get; set; } = TicketStatus.review;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("comments")]
    public ICollection<Comment> Comments { get; set; } = null!;

    [Required, ForeignKey("Creator"), Column("creator")]
    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;

    [ForeignKey("AssignedTo"), Column("assigned_to")]
    public int? AssignedToId { get; set; }
    public User? AssignedTo { get; set; }
}
