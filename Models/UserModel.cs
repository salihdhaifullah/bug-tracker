using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

public enum Role
{
    ADMIN,
    PROJECT_MANGER,
    DEVELOPER,
    REPORTER
}


[Table("users")]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Role))]
[Index(nameof(FirstName), nameof(LastName))]
public class User
{
    [Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
    [Column("created_at"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [Column("role"), EnumDataType(typeof(Role))]
    public Role Role { get; set; } = Role.REPORTER;
    [Column("image")]
    public byte[]? Image { get; set; }
}


