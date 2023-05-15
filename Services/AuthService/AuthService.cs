using Buegee.Services.JWTService;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace Buegee.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;

    public AuthService(IJWTService jwt){ _jwt = jwt; }

    public void LogIn(int id, HttpContext ctx, Roles role = Roles.REPORTER)
    {
        // a year
        var age = new TimeSpan(365, 0, 0, 0);

        var claims = new Dictionary<string, string>();
        claims["id"] = id.ToString();
        claims["role"] = role.ToString();
        claims["agent"] = GetUserAgent(ctx);

        // set auth cookie token
        ctx.Response.Cookies.Append("auth", _jwt.GenerateJwt(age, claims), Main.CookieConfig(age));
    }

    public IActionResult? CheckPermissions(HttpContext ctx, List<Roles> roles, out int? id)
    {
        id = null;

        var result = new HttpResult()
                        .IsOk(false)
                        .StatusCode(401)
                        .Massage("you need to login to do this action");

        // is auth cookie found
        if (!ctx.Request.Cookies.TryGetValue("auth", out var token) || String.IsNullOrEmpty(token)) return result.Get();

        try
        {
            // if token un-valid VerifyJwt method will throw
            var data = _jwt.VerifyJwt(token);

            // get id
            if (!data.TryGetValue("id", out var idStr) || String.IsNullOrEmpty(idStr) || !int.TryParse(idStr, out var userId)) return result.Get();

            // get agent
            if (!data.TryGetValue("agent", out var agent) || String.IsNullOrEmpty(agent)) return result.Get();

            // get role
            if (!data.TryGetValue("role", out var roleStr) || !Enum.TryParse(roleStr, out Roles role) )return result.Get();

            // check if user role match one of the list of roles allowed to do this action
            if (!roles.Contains(role)) return result.Massage("you do not have the permissions to do this action")
                            .StatusCode(403)
                            .RedirectTo("/403")
                            .Get();

            // invalidated user token if user agent changed
            if (agent != GetUserAgent(ctx))
            {
                ctx.Response.Cookies.Delete("auth");
                return result.Get();
            }

            id = userId;

        }
        catch (Exception)
        {
            return result.Get();
        }

        // user are good
        return null;
    }

    private string GetUserAgent(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(HeaderNames.UserAgent, out var userAgent))
        {
            return userAgent.ToString();
        }
        return "not-found";
    }
}
