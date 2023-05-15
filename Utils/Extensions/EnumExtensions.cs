using System.Reflection;
using Buegee.Utils.Attributes;

namespace Buegee.Utils.Extensions;

public static class EnumExtensions
{
    public static string? GetStringValue(this Enum value)
    {
        try
        {
            return value.GetType()
            .GetField(value.ToString())
            ?.GetCustomAttribute<StringValueAttribute>()
            ?.Value;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
