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
    [Key, Column("id"), StringLength(26)]
    public required string Id { get; set; } = null!;

    [Required, Column("name"), StringLength(100)]
    public required string Name { get; set; } = null!;

    [Required, Column("type"), EnumDataType(typeof(TicketType))]
    public TicketType Type { get; set; } = TicketType.bug;

    [Required, Column("priority"), EnumDataType(typeof(Priority))]
    public Priority Priority { get; set; } = Priority.medium;

    [Required, Column("status"), EnumDataType(typeof(Status))]
    public Status Status { get; set; } = Status.review;

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Project"), Column("project_id"), StringLength(26)]
    public required string ProjectId { get; set; } = null!;
    public Project Project { get; set; } = null!;

    [Required, ForeignKey("Creator"), Column("creator_id"), StringLength(26)]
    public required string CreatorId { get; set; } = null!;
    public Member Creator { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id"), StringLength(26)]
    public required string ContentId { get; set; } = null!;
    public Content Content { get; set; } = null!;

    [ForeignKey("AssignedTo"), Column("assigned_to_id"), StringLength(26)]
    public string? AssignedToId { get; set; }
    public Member? AssignedTo { get; set; }

    [Column("comments")]
    public List<Comment> Comments { get; set; } = new List<Comment>();

    [Column("Attachments")]
    public List<Attachment> Attachments { get; set; } = new List<Attachment>();
}
