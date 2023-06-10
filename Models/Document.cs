using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("document")]
public class Document
{
    [Key, Column("id"), StringLength(26)]
    public string Id { get; set; } = null!;

    [Required, Column("name")]
    public string Name { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id"), StringLength(26)]
    public string ContentId { get; set; } = null!;
    public Content Content { get; set; } = null!;
}
