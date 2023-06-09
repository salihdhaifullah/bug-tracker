using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("member")]
[Index(nameof(UserId), nameof(ProjectId), IsUnique = true)]
public class Member
{
    [Key, Column("id"), MinLength(26), MaxLength(26)]
    public string Id { get; set; } = null!;

    [Required, ForeignKey("User"), Column("user_id"), MinLength(26), MaxLength(26)]
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    [Required, ForeignKey("Project"), Column("project_id"), MinLength(26), MaxLength(26)]
    public string ProjectId { get; set; } = null!;
    public Project Project { get; set; } = null!;

    [Column("assigned_to")]
    public List<Ticket> AssignedTo { get; set; } = new List<Ticket>();

    [Column("joined_at")]
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
