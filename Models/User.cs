using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("user")]
[Index(nameof(FirstName), nameof(LastName))]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    [Key, Column("id"), StringLength(26)]
    public required string Id { get; set; } = null!;

    [Required, Column("email"), StringLength(100), EmailAddress]
    public required string Email { get; set; } = null!;

    [Required, Column("first_name"), StringLength(50)]
    public required string FirstName { get; set; } = null!;

    [Required, Column("last_name"), StringLength(50)]
    public required string LastName { get; set; } = null!;

    [Required, Column("password_hash")]
    public required byte[] PasswordHash { get; set; } = null!;

    [Required, Column("password_salt")]
    public required byte[] PasswordSalt { get; set; } = null!;

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Content"), Column("content_id"), StringLength(26)]
    public required string ContentId { get; set; } = null!;
    public Content Content { get; set; } = null!;

    [Required, Column("image_name")]
    public required string ImageName { get; set; } = null!;

    [Column("bio"), StringLength(100)]
    public string Bio { get; set; } = string.Empty;

    [Column("member_ships")]
    public List<Member> MemberShips { get; set; } = new List<Member>();

    [Column("Projects")]
    public List<Project> Projects { get; set; } = new List<Project>();
}
