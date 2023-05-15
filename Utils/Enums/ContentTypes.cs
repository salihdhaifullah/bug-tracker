using Buegee.Utils.Attributes;

namespace Buegee.Utils.Enums;
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
