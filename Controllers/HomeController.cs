using System.Text.Json;
using System.Text.Json.Serialization;
using Buegee.Services;
using Microsoft.AspNetCore.Mvc;
using Buegee.Extensions.Attributes;

namespace Buegee.Controllers;

[ApiRoute]
public class HomeController : Controller
{
    private readonly DataContext _ctx;
    public HomeController(DataContext ctx)
    {
        _ctx = ctx;
    }

    [HttpGet]
    public string Index()
    {
        return "<h1>Hello World</h1>";
    }

    [HttpGet("test")]
    public IActionResult Test()
    {

        var User = new User();
        User.Id = 1;
        User.Role = "ADMIN";
        User.Token = "UIBYTDKLGIUHOIOGLFDKTYKFYLGUOIHHOGULFKUT^";

        var data = new HTTPCustomResult<User>(ResponseTypes.ok, "login success", null, User);
        return Ok(data.ToJson());
    }

}

public class User
{
    [JsonPropertyName("token")]
    public string? Token { get; set; }
    [JsonPropertyName("role")]
    public string? Role { get; set; }
    [JsonPropertyName("id")]
    public int Id { get; set; }
}


public class HTTPCustomResult<T>
{

    private readonly T? _Body;
    private readonly string? _RedirectTo;
    private readonly string _Message;
    private readonly string _Type;

    public HTTPCustomResult(ResponseTypes Type, string Message, string? RedirectTo, T? Body)
    {
        _Type = Type.ToString();
        _Message = Message;
        _RedirectTo = RedirectTo;
        _Body = Body;
    }

    public string ToJson()
    {
        return JsonSerializer.Serialize(new { body = _Body, redirectTo = _RedirectTo, message = _Message, type = _Type });
    }
}

public class HTTPCustomResult : HTTPCustomResult<object>
{
    public HTTPCustomResult(ResponseTypes Type, string Message, string? RedirectTo = null)
    : base(Type, Message, RedirectTo, null) { }
}

public enum ResponseTypes
{
    ok,
    error
}
