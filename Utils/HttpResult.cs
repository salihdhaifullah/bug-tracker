using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Utils;

public class HttpResult {
    private string? _message {get; set;} = null;
    private string? _redirectTo {get; set;} = null;
    private object? _body {get; set;} = null;
    private int _statusCode {get; set;} = 200;
    private bool _isOk {get; set;} = true;

    public HttpResult Message(string message) {
        _message = message;
        return this;
    }

    public HttpResult IsOk(bool isOk) {
        _isOk = isOk;
        return this;
    }

    public HttpResult RedirectTo(string redirectTo) {
        _redirectTo = redirectTo;
        return this;
    }

    public HttpResult Body(object body) {
        _body = body;
        return this;
    }

    public HttpResult StatusCode(int statusCode) {
        _statusCode = statusCode;
        return this;
    }

    public IActionResult Get() {
        var httpJson = JsonSerializer.Serialize(new {
            type = _isOk ? "ok" : "error",
            message = _message,
            redirectTo = _redirectTo,
            body = _body
        });

        return new ObjectResult(httpJson) {StatusCode = _statusCode };
    }
}
