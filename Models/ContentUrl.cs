using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("content_url")]
public class ContentUrl
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, ForeignKey("Content"), Column("content_id")]
    public int ContentId { get; set; }
    public Content Content { get; set; } = null!;

    [Required, Column("url")]
    public string url { get; set; } = null!;
}
