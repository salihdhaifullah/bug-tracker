using Buegee.Models;
using Buegee.Services.JWTService;

namespace Buegee.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;

    public AuthService(IJWTService jwt)
    {
        _jwt = jwt;
    }

    public AuthorizationResult GetAuthorizationResult(string jwtToken)
    {
        var result = new AuthorizationResult();

        if (string.IsNullOrEmpty(jwtToken)) return result;

        var (payload, error) = _jwt.VerifyJwt(jwtToken);

        if (error is not null || payload is null) return result;

        var roleName = payload["role"];
        var userIdClaim = payload["id"];

        if (roleName is null
            || userIdClaim is null
            || !int.TryParse(userIdClaim, out var userId)
            || !Enum.TryParse(roleName, out Role userRole)
            ) return result;

        result.Id = userId;
        result.Role = userRole;
        result.IsAuthorized = true;

        return result;
    }

    public RoleAuthorizationResult GetAuthorizationResult(string jwtToken, Role[] requiredRoles)
    {
        var result = new RoleAuthorizationResult();

        if (string.IsNullOrEmpty(jwtToken)) return result;

        var (payload, error) = _jwt.VerifyJwt(jwtToken);

        if (error is not null || payload is null) return result;

        var roleName = payload["role"];
        var userIdClaim = payload["id"];

        if (roleName is null
            || userIdClaim is null
            || !int.TryParse(userIdClaim, out var userId)
            || !Enum.TryParse(roleName, out Role userRole)
            ) return result;

        result.Id = userId;
        result.Role = userRole;
        result.IsAuthorized = true;

        if (requiredRoles is null || requiredRoles.Length == 0)
        {
            result.IsAuthorizedRole = true;
            return result;
        }

        result.IsAuthorizedRole = requiredRoles.Contains(userRole);
        return result;
    }

    public class AuthorizationResult
    {
        public Role? Role { get; set; } = null;
        public int? Id { get; set; } = null;
        public bool IsAuthorized { get; set; } = false;
    }

    public class RoleAuthorizationResult : AuthorizationResult {
        public bool IsAuthorizedRole { get; set; } = false;
    }
}
