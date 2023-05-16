using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models.DB;

[Table("project")]
[Index(nameof(Name), IsUnique = true)]
[Index(nameof(ProjectMangerId))]
public class ProjectDB
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, StringLength(100), Column("name")]
    public string Name { get; set; } = null!;

    [Required, Column("description")]
    public string Description { get; set; } = null!;

    [Column("tickets")]
    public ICollection<TicketDB> Tickets { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("ProjectManger"), Column("project_manger")]
    public int ProjectMangerId { get; set; }
    public UserDB ProjectManger { get; set; } = null!;
}
