using Buegee.Controllers;
using Buegee.Extensions.Classes;
using Buegee.Extensions.Enums;
using Buegee.Services.JWTService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace Buegee.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;

    public AuthService(IJWTService jwt){ _jwt = jwt; }

    public void LogIn(int Id, HttpContext ctx, Roles role = Roles.REPORTER)
    {
        // a year
        var Duration = new TimeSpan(365, 0, 0, 0);

        // config cookies
        var cookieOptions = new CookieOptions()
        {
            IsEssential = true,
            Secure = true,
            HttpOnly = true,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
            MaxAge = Duration
        };

        // generate claims
        var IdClaim = new Claim { Name = "id", Value = Id.ToString() };
        var RoleClaim = new Claim { Name = "role", Value = role.ToString() };
        var AgentClaim = new Claim { Name = "agent", Value = GetUserAgent(ctx) };

        // set auth cookie token
        ctx.Response.Cookies.Append("auth", _jwt.GenerateJwt(Duration, new List<Claim> { IdClaim, RoleClaim, AgentClaim }), cookieOptions);
    }

    public IActionResult? CheckPermissions(HttpContext ctx, List<Roles> roles, out int? ID)
    {
        ID = null;

        var Unauthorized = new ObjectResult(new HTTPCustomResult(ResponseTypes.error, $"you need to login to do this action", "auth/login").ToJson()) { StatusCode = StatusCodes.Status401Unauthorized };

        // is auth cookie found
        if (!ctx.Request.Cookies.TryGetValue("auth", out var Token) || String.IsNullOrEmpty(Token))
        {
            return Unauthorized;
        }

        try
        {
            // if token un-valid VerifyJwt method will throw
            var data = _jwt.VerifyJwt(Token);


            // get id
            if (!data.TryGetValue("id", out var IdStr) || String.IsNullOrEmpty(IdStr) || !int.TryParse(IdStr, out var Id))
            {
                return Unauthorized;
            }

            // get agent
            if (!data.TryGetValue("agent", out var agent) || String.IsNullOrEmpty(agent))
            {
                return Unauthorized;
            }

            // get role
            if (!data.TryGetValue("role", out var roleStr) || !Enum.TryParse(roleStr, out Roles role))
            {
                return Unauthorized;
            }


            // check if user role match one of the list of roles allowed to do this action
            if (!roles.Contains(role))
            {
                return new ObjectResult(new HTTPCustomResult(ResponseTypes.error, $"your not authorized to do this action", "403").ToJson()) { StatusCode = StatusCodes.Status403Forbidden }; ;
            }

            // invalidated user token if user agent changed
            if (agent != GetUserAgent(ctx))
            {
                ctx.Response.Cookies.Delete("auth");
                return Unauthorized;
            }

            ID = Id;

        }
        catch (Exception)
        {
            return Unauthorized;
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
