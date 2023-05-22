using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Buegee.Utils.Enums;

namespace Buegee.Models;

[Table("files")]
public class Document
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("data")]
    public byte[] Data { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("is_private")]
    public bool IsPrivate { get; set; } = false;

    [Column("content_type"), EnumDataType(typeof(ContentTypes))]
    public ContentTypes ContentType { get; set; } = ContentTypes.text;
}