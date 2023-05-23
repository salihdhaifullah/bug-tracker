using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("member")]
[Index(nameof(UserId), IsUnique = true)]
public class Member
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, ForeignKey("User"), Column("user")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
