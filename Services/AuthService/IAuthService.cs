using Buegee.Extensions.Classes;
using Buegee.Extensions.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public AuthorizationResult GetAuthorizationResult(string jwtToken, Roles[] requiredRoles);
    public AuthorizationResult GetAuthorizationResult(string jwtToken);
    public Task<IActionResult?> Authorization(HttpContext ctx, List<Roles> roles);
    public Task Authenticator(int Id, HttpContext ctx, Roles role = Roles.REPORTER);
}
