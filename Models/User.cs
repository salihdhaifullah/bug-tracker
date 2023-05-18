using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("users")]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(FirstName), nameof(LastName))]
public class User
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("first_name"), StringLength(50)]
    public string FirstName { get; set; } = null!;

    [Required, Column("last_name"), StringLength(50)]
    public string LastName { get; set; } = null!;

    [Required, Column("email"), StringLength(100), EmailAddress]
    public string Email { get; set; } = null!;

    [Required, Column("password_hash")]
    public byte[] PasswordHash { get; set; } = null!;

    [Required, Column("password_salt")]
    public byte[] PasswordSalt { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("projects")]
    public ICollection<Project> Projects {get; set;} = null!;

    [Required, ForeignKey("Image"), Column("image")]
    public int ImageId { get; set; }
    public Document Image { get; set; } = null!;

    [Column("title"), StringLength(100)]
    public string? Title { get; set; }

    [ForeignKey("Profile"), Column("profile")]
    public int? ProfileId { get; set; }
    public Content? Profile { get; set; }
}
