using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;

namespace Buegee.Models.DB;

[AttributeUsage(AttributeTargets.Field)]
public class StringValueAttribute : Attribute
{
    private string _value;

    public StringValueAttribute(string value)
    {
        _value = value;
    }

    public string Value
    {
        get { return _value; }
    }
}

public static class EnumExtensions
{
    public static string GetStringValue(this Enum value)
    {
        var ContentType = value.GetType()
                    .GetField(value.ToString())
                    ?.GetCustomAttribute<StringValueAttribute>()
                    ?.Value;

        return ContentType ?? "text/plain";
    }
}

public enum ContentTypes
{
    [StringValue("image/jpeg")]
    JPEG,
    [StringValue("image/png")]
    PNG,
    [StringValue("image/svg+xml")]
    SVG,
    [StringValue("text/plain")]
    TEXT,
}

[Table("files")]
public class FileDB
{
    [Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required, Column("data")]
    public byte[] Data { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("is-private")]
    public bool IsPrivate { get; set; } = true;

    [Column("content-type"), EnumDataType(typeof(ContentTypes))]
    public ContentTypes ContentType { get; set; } = ContentTypes.TEXT;
}
