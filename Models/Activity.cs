using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("activity")]
public class Activity
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Project"), Column("project_id")]
    public int ProjectId { get; set; }
    public virtual Project Project { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id")]
    public int ContentId { get; set; }
    public virtual Content Content { get; set; } = null!;
}
