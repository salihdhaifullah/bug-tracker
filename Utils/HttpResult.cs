using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Utils;

internal class HttpResult
{
    private string? _message { get; set; } = null;
    private string? _redirectTo { get; set; } = null;
    private object? _body { get; set; } = null;
    private int _statusCode { get; set; } = 200;
    private bool _isOk { get; set; } = true;

    public HttpResult Message(string message)
    {
        _message = message;
        return this;
    }

    public HttpResult IsOk(bool isOk)
    {
        _isOk = isOk;
        return this;
    }

    public HttpResult RedirectTo(string redirectTo)
    {
        _redirectTo = redirectTo;
        return this;
    }

    public HttpResult Body(object body)
    {
        _body = body;
        return this;
    }

    public HttpResult StatusCode(int statusCode)
    {
        _statusCode = statusCode;
        return this;
    }

    public IActionResult Get()
    {
        var httpJson = JsonSerializer.Serialize(new
        {
            type = _isOk ? "ok" : "error",
            message = _message,
            redirectTo = _redirectTo,
            body = _body
        });

        return new ObjectResult(httpJson) { StatusCode = _statusCode };
    }

    private static IActionResult helper(HttpResult result, string? massage = null, object? body = null, string? redirectTo = null)
    {
        if (redirectTo is not null) result.RedirectTo(redirectTo);
        if (massage is not null) result.Message(massage);
        if (body is not null) result.Body(body);
        return result.Get();
    }

    public static IActionResult Ok(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(true).StatusCode(StatusCodes.Status200OK);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult Created(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(true).StatusCode(StatusCodes.Status201Created);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult NotFound(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status404NotFound);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult BadRequest(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status400BadRequest);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult InternalServerError(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status500InternalServerError);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult UnAuthorized(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status401Unauthorized);
        return helper(result, massage, body, redirectTo);
    }

    public static IActionResult Forbidden(string? massage = null, object? body = null, string? redirectTo = null)
    {
        var result = new HttpResult().IsOk(false).StatusCode(StatusCodes.Status403Forbidden);
        return helper(result, massage, body, redirectTo);
    }
}
