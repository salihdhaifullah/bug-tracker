using Buegee.Extensions.Attributes;

namespace Buegee.Extensions.Enums;
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
