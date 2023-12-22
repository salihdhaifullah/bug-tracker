using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("content")]
public class Content
{
    [Key, Column("id"), StringLength(26)]
    public required string Id { get; set; } = null!;

    [Required, Column("markdown")]
    public string Markdown { get; set; } = string.Empty;

    [Column("documents")]
    public List<Document> Documents { get; set; } = new List<Document>();

    [Column("user_id"), StringLength(26)]
    public required string UserId { get; set; } = string.Empty;
}
