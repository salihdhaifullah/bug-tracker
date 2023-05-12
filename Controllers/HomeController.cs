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

        var data = new HTTPCustomResult<User>();
        data.Body = User;
        data.Message = "login successfuly";
        data.Type = ResponseTypes.ok.ToString();
        var result = JsonSerializer.Serialize<HTTPCustomResult<User>>(data);
        return Ok(result);
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
    [JsonPropertyName("redirectTo")]
    public string? RedirectTo { get; set; }
    [JsonPropertyName("body")]
    public T? Body { get; set; }
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    [JsonPropertyName("type")]
    public string Type {get; set;} = ResponseTypes.ok.ToString();
}

public enum ResponseTypes {
    ok,
    error,
    validationError
}
