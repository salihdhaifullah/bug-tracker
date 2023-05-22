using Buegee.Utils.Attributes;

namespace Buegee.Utils.Enums;
public enum ContentTypes
{
    [StringValue("image/jpeg")]
    jpeg,
    [StringValue("image/png")]
    png,
    [StringValue("image/svg+xml")]
    svg,
    [StringValue("image/webp")]
    webp,
    [StringValue("text/plain")]
    text,
}
