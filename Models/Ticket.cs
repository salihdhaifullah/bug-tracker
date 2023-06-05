using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Utils.Enums;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("ticket")]
[Index(nameof(Name))]
[Index(nameof(Type))]
[Index(nameof(Priority))]
[Index(nameof(Status))]
public class Ticket
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("name"), StringLength(100)]
    public string Name { get; set; } = null!;

    [Required, Column("type"), EnumDataType(typeof(TicketType))]
    public TicketType Type { get; set; } = TicketType.bug;

    [Required, Column("priority"), EnumDataType(typeof(TicketPriority))]
    public TicketPriority Priority { get; set; } = TicketPriority.medium;

    [Required, Column("status"), EnumDataType(typeof(TicketStatus))]
    public TicketStatus Status { get; set; } = TicketStatus.review;

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Project"), Column("project_id")]
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [Required, ForeignKey("Creator"), Column("creator_id")]
    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id")]
    public int ContentId { get; set; }
    public Content Content { get; set; } = null!;

    [ForeignKey("AssignedTo"), Column("assigned_to_id")]
    public int? AssignedToId { get; set; }
    public Member? AssignedTo { get; set; }

    [Column("comments")]
    public List<Comment> Comments { get; set; } = new List<Comment>();
}
