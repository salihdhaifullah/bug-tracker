using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("content")]
public class Content
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("markdown")]
    public string Markdown {get; set;} = null!;
}
