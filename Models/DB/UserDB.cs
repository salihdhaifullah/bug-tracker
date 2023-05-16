using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Utils.Enums;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models.DB;

[Table("users")]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Role))]
[Index(nameof(FirstName), nameof(LastName))]
public class UserDB
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

    [Column("role"), EnumDataType(typeof(Roles))]
    public Roles Role { get; set; } = Roles.reporter;

    [Required, ForeignKey("Image"), Column("image")]
    public int ImageId { get; set; }
    public FileDB Image { get; set; } = null!;

    [Column("title"), StringLength(100)]
    public string? Title { get; set; }
}
