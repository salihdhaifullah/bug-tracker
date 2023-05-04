using System.Text;
namespace Buegee.Extensions.Utils;

public static class Base64
{
    public static string UrlEncode(string str)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
    }

    public static string UrlDecode(string b64)
    {
        return Encoding.UTF8.GetString(Convert.FromBase64String(b64));
    }
}
