using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Extensions.Enums;

namespace Buegee.Models.DB;

[Table("files")]
public class FileDB
{
    [Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required, Column("data")]
    public byte[] Data { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("is_private")]
    public bool IsPrivate { get; set; } = true;

    [Column("content_type"), EnumDataType(typeof(ContentTypes))]
    public ContentTypes ContentType { get; set; } = ContentTypes.TEXT;
}
