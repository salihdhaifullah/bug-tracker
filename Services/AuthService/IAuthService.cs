using Buegee.Models;
using static Buegee.Services.AuthService.AuthService;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public RoleAuthorizationResult GetAuthorizationResult(string jwtToken, Role[] requiredRoles);
    public AuthorizationResult GetAuthorizationResult(string jwtToken);
}
