using Buegee.Models.DB;
using static Buegee.Services.AuthService.AuthService;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public RoleAuthorizationResult GetAuthorizationResult(string jwtToken, Roles[] requiredRoles);
    public AuthorizationResult GetAuthorizationResult(string jwtToken);
}
