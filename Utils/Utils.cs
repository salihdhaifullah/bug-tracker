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
            result = BadRequestResult(errorMessage);
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


    private static IActionResult helper(HttpResult result, string? massage = null, object? body = null, string? redirectTo = null)
    {
        if (redirectTo is not null) result.RedirectTo(redirectTo);
        if (massage is not null) result.Message(massage);
        if (body is not null) result.Body(body);
        return result.Get();
    }

    public static IActionResult OkResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(true).StatusCode(StatusCodes.Status200OK);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult CreatedResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(true).StatusCode(StatusCodes.Status201Created);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult NotFoundResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status404NotFound);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult BadRequestResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status400BadRequest);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult InternalServerErrorResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status500InternalServerError);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult UnAuthorizedResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status401Unauthorized);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult ForbiddenResult(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status403Forbidden);
        return helper(result, massage, body, redirectTo);
    }
}
