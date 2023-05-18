using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("activity")]
public class Activity
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, ForeignKey("Content"), Column("content")]
    public int ContentId { get; set; }
    public Content Content { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
