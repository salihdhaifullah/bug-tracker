using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models.DB;

public enum Roles
{
    ADMIN, // can edit delete and create projects, users, roles, tickets
    PROJECT_MANGER, // can verify fixes, create and assign tasks, set priorities and deadlines, monitor progress and status, generate reports
    DEVELOPER, // can view and update bugs assigned to them, submit patches or fixes, comment on bugs
    REPORTER // report bugs,  view bugs and their details, but cannot modify or comment on them.
}


[Table("users")]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Role))]
[Index(nameof(FirstName), nameof(LastName))]
public class UserDB
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
    [Column("role"), EnumDataType(typeof(Roles))]
    public Roles Role { get; set; } = Roles.REPORTER;
    [Column("image")]
    public byte[]? Image { get; set; }
}


