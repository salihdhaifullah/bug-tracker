using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Utils.Enums;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models.DB;

[Table("ticket")]
[Index(nameof(Title))]
[Index(nameof(Type))]
[Index(nameof(Priority))]
[Index(nameof(Status))]
public class TicketDB
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("title"), StringLength(100)]
    public string Title { get; set; } = null!;

    [Required, Column("description")]
    public string Description { get; set; } = null!;

    [Column("type"), EnumDataType(typeof(TicketType))]
    public TicketType Type { get; set; } = TicketType.bug;

    [Column("priority"), EnumDataType(typeof(TicketPriority))]
    public TicketPriority Priority { get; set; } = TicketPriority.medium;

    [Column("status"), EnumDataType(typeof(TicketStatus))]
    public TicketStatus Status { get; set; } = TicketStatus.review;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("files")]
    public ICollection<FileDB> Files { get; set; } = null!;

    [Column("comments")]
    public ICollection<CommentDB> Comments { get; set; } = null!;

    [ForeignKey("AssignedTo"), Column("assigned_to")]
    public int? AssignedToId { get; set; }
    public UserDB? AssignedTo { get; set; } = null;

    [ForeignKey("Reporter"), Column("reporter")]
    public int? ReporterId { get; set; }
    public UserDB? Reporter { get; set; } = null;

    [ForeignKey("Creator"), Column("creator")]
    public int? CreatorId { get; set; }
    public UserDB? Creator { get; set; } = null;
}
