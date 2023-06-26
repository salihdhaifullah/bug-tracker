using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Utils.Enums;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("member")]
[Index(nameof(UserId), nameof(ProjectId), IsUnique = true)]
public class Member
{
    [Key, Column("id"), StringLength(26)]
    public string Id { get; set; } = null!;

    [Required, ForeignKey("User"), Column("user_id"), StringLength(26)]
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    [Required, ForeignKey("Project"), Column("project_id"), StringLength(26)]
    public string ProjectId { get; set; } = null!;
    public Project Project { get; set; } = null!;

    [Column("assigned_to")]
    public List<Ticket> AssignedTo { get; set; } = new List<Ticket>();

    [Column("joined_at")]
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [Column("role"), EnumDataType(typeof(Role))]
    public Role Role { get; set; } = Role.developer;

    [Column("is_joined")]
    public bool IsJoined { get; set; } = false;
}
