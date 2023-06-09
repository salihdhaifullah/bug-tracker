using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("activity")]
public class Activity
{
    [Key, Column("id"), MinLength(26), MaxLength(26)]
    public string Id { get; set; } = null!;

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, ForeignKey("Project"), Column("project_id"), MinLength(26), MaxLength(26)]
    public string ProjectId { get; set; } = null!;
    public Project Project { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id"), MinLength(26), MaxLength(26)]
    public string ContentId { get; set; } = null!;
    public Content Content { get; set; } = null!;
}
