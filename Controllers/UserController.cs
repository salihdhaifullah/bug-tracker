using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Buegee.Utils.Utils;

namespace Buegee.Controllers;

[ApiRoute("user")]
[Consumes("application/json")]
public class UserController : Controller
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;

    public UserController(DataContext ctx, IAuthService auth)
    {
        _auth = auth;
        _ctx = ctx;
    }

    [HttpPost("upload-profile")]
    public async Task<IActionResult> UploadProfile([FromBody] UploadProfileDTO dto)
    {
        var result = _auth.CheckPermissions(HttpContext, out var userId);

        if (result is not null) return result;

        if (TryGetModelErrorResult(ModelState, out var modelResult)) return modelResult!;

        ContentTypes contentType = (ContentTypes)Enum.Parse(typeof(ContentTypes), dto.ContentType);

        var isFound = _ctx.Users.Include(u => u.Image).FirstOrDefault(u => u.Id == userId);

        if (isFound is null) return new HttpResult().IsOk(false).StatusCode(404).Message("user not found please sing-up").RedirectTo("/auth/sing-up").Get();

        Console.WriteLine($"\n\n\t isFound and isFound.Image is not null {isFound.Image.Id}");

        isFound.Image.ContentType = contentType;
        isFound.Image.Data = Convert.FromBase64String(dto.Data);

        await _ctx.SaveChangesAsync();

        Console.WriteLine("\n\n\t Saved Changes Async ");

        return new HttpResult().IsOk(true).Message("successfully changed profile image").Get();
    }

}
