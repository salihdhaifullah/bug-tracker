using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("content")]
public class Content
{
    [Key, Column("id"), StringLength(26)]
    public string Id { get; set; } = null!;

    [Required, Column("markdown")]
    public string Markdown { get; set; } = string.Empty;

    [Required, Column("owner_id"), StringLength(26)]
    public string OwnerId { get; set; } = null!;

    [Column("documents")]
    public List<Document> Documents { get; set; } = new List<Document>();
}
