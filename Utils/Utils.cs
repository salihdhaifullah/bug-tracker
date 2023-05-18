using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Buegee.Utils;
public static class Utils
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

    public static bool TryGetModelErrorResult(ModelStateDictionary model, out IActionResult? result)
    {
        result = null;
        if (model.IsValid) return false;

        var errorMessage = model.Values.SelectMany(v => v.Errors).FirstOrDefault()?.ErrorMessage;

        if (!String.IsNullOrEmpty(errorMessage))
        {
            result = new HttpResult()
                    .IsOk(false)
                    .Message(errorMessage)
                    .StatusCode(400)
                    .Get();

            return true;
        }

        return false;
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


}
