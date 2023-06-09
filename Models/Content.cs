using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("content")]
public class Content
{
    [Key, Column("id"), MinLength(26), MaxLength(26)]
    public string Id { get; set; } = null!;

    [Required, Column("markdown")]
    public string Markdown { get; set; } = null!;

    [Required, Column("owner_id"), MinLength(26), MaxLength(26)]
    public string OwnerId { get; set; } = null!;

    [Column("documents")]
    public List<Document> Documents { get; set; } = new List<Document>();
}
