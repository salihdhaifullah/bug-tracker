using Buegee.Extensions.Classes;
using Buegee.Extensions.Enums;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public AuthorizationResult GetAuthorizationResult(string jwtToken, Roles[] requiredRoles);
    public AuthorizationResult GetAuthorizationResult(string jwtToken);
}
