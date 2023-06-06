using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("document")]
public class Document
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("url")]
    public string Url { get; set; } = null!;

    [Required, Column("name")]
    public string Name { get; set; } = null!;
}
