using System.Reflection;
using Buegee.Extensions.Attributes;

namespace Buegee.Extensions.Utils;

public static class EnumExtensions
{
    public static string? GetStringValue(this Enum value)
    {
        return value.GetType()
                    .GetField(value.ToString())
                    ?.GetCustomAttribute<StringValueAttribute>()
                    ?.Value;
    }
}
