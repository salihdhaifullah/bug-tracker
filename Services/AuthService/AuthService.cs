using Buegee.Extensions.Classes;
using Buegee.Extensions.Enums;
using Buegee.Services.JWTService;

namespace Buegee.Services.AuthService;
// TODO store user data in redis cache service and give them a hashed id to be stored in users cookies

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

        Dictionary<string, string> payload;

        try
        {
            payload = _jwt.VerifyJwt(jwtToken);
        }
        catch (Exception)
        {
            return result;
        }

        var roleName = payload["role"];
        var userIdClaim = payload["id"];

        if (
            roleName is null
            || userIdClaim is null
            || !int.TryParse(userIdClaim, out var userId)
            || !Enum.TryParse(roleName, out Roles userRole)
            ) return result;

        result.Id = userId;
        result.Role = userRole;
        result.IsAuthorized = true;

        return result;
    }

    public AuthorizationResult GetAuthorizationResult(string jwtToken, Roles[] requiredRoles)
    {
        var result = new AuthorizationResult();

        if (string.IsNullOrEmpty(jwtToken)) return result;

        Dictionary<string, string> payload;

        try
        {
            payload = _jwt.VerifyJwt(jwtToken);
        }
        catch (Exception)
        {
            return result;
        }

        var roleName = payload["role"];
        var userIdClaim = payload["id"];

        if (roleName is null
            || userIdClaim is null
            || !int.TryParse(userIdClaim, out var userId)
            || !Enum.TryParse(roleName, out Roles userRole)
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


}
