using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("content")]
public class Content {
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("html")]
    public string Html {get; set;} = null!;

    [Column("files")]
    public ICollection<Document> Files { get; set; } = null!;
}
