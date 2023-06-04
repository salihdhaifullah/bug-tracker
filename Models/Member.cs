using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("member")]
[Index(nameof(UserId), nameof(ProjectId), IsUnique = true)]
public class Member
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, ForeignKey("User"), Column("user_id")]
    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    [Required, ForeignKey("Project"), Column("project_id")]
    public int ProjectId { get; set; }
    public virtual Project Project { get; set; } = null!;

    [Column("assigned_to")]
    public virtual ICollection<Ticket> AssignedTo { get; set; } = new List<Ticket>();

    [Column("joined_at")]
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
