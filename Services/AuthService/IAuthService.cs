using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public void LogIn(int Id, HttpContext ctx, Roles role = Roles.REPORTER);
    public IActionResult? CheckPermissions(HttpContext ctx, List<Roles> roles, out int? id);
}
