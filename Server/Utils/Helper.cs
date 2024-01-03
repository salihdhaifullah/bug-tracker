using System.Text;
using Microsoft.AspNetCore.StaticFiles;

namespace Buegee.Utils;
public static class Helper
{
    public static string UrlEncode(string str)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
    }

    public static string UrlDecode(string b64)
    {
        return Encoding.UTF8.GetString(Convert.FromBase64String(b64));
    }

    public static string RandomCode(int length = 6)
    {
        var random = new Random();
        var codeStringBuilder = new StringBuilder();

        for (int i = 0; i < length; i++) codeStringBuilder.Append(random.Next(10));

        return codeStringBuilder.ToString();
    }


    public static CookieOptions CookieConfig(TimeSpan duration)
    {
        return new CookieOptions()
        {
            IsEssential = true,
            Secure = true,
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            MaxAge = duration
        };
    }

    public static T? ParseEnum<T>(string? type) where T : struct, Enum
    {
        T? result = null;
        if (!string.IsNullOrEmpty(type) && Enum.TryParse(type, true, out T parsedType))
        {
            result = parsedType;
        }
        return result;
    }

    public static string GetContentType(string fileName)
    {
        var provider = new FileExtensionContentTypeProvider();
        if (provider.TryGetContentType(fileName, out var mimeMapping))
        {
            return mimeMapping;
        }

        return "application/octet-stream";
    }
}
