using System.Text.Json;
using System.Text.Json.Serialization;
using Buegee.Extensions.Classes;
using Buegee.Extensions.Enums;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace Buegee.Services.AuthService;
// TODO store user data in redis cache service and give them a hashed id to be stored in users cookies

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;
    private readonly IRedisCacheService _cache;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IJWTService jwt, IRedisCacheService cache, ILogger<AuthService> logger)
    {
        _jwt = jwt;
        _cache = cache;
        _logger = logger;
    }

    public async Task Authenticator(int Id, HttpContext ctx, Roles role = Roles.REPORTER)
    {
        // a year
        var SessionTimeSpan = new TimeSpan(365, 0, 0, 0);

        // config cookies
        var cookieOptions = new CookieOptions()
        {
            IsEssential = true,
            Secure = true,
            HttpOnly = true,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
            MaxAge = SessionTimeSpan
        };

        // id for user auth
        var AuthId = Guid.NewGuid().ToString();

        // generate jwt
        var Token = _jwt.GenerateJwt(SessionTimeSpan, new List<Claim> { new Claim { Name = "auth", Value = AuthId } });

        // set auth cookie token
        ctx.Response.Cookies.Append("auth", Token, cookieOptions);

        var currentAgent = GetUserAgent(ctx);

        _logger.LogCritical($"currentAgent is {currentAgent}");

        // initialize new auth instants
        var auth = new Auth()
        {
            Id = Id,
            role = role,
            Agent = currentAgent,
        };

        _logger.LogInformation($"auth.Agent is {auth.Agent}");
        _logger.LogInformation($"auth.Id is {auth.Id}");
        _logger.LogInformation($"auth.role is {auth.role}");
        // Serialize data
        string Data = JsonSerializer.Serialize(auth);

        _logger.LogCritical($"Data is {Data}");

        // store auth instants by AuthId
        await _cache.Redis.StringSetAsync(AuthId, Data, SessionTimeSpan);
    }

    public async Task<IActionResult?> Authorization(HttpContext ctx, List<Roles> roles)
    {
        // is auth cookie found
        if (!ctx.Request.Cookies.TryGetValue("auth", out var Token) || String.IsNullOrEmpty(Token))
        {
            _logger.LogCritical($"1 Token is {Token}");
            return new UnauthorizedResult();
        }

            _logger.LogCritical($"1-1 Token is {Token}");


        // Verify and decode Jwt to get authId
        string? AuthId;
        try
        {
            var data = _jwt.VerifyJwt(Token);

            if (!data.TryGetValue("auth", out var Id) || String.IsNullOrEmpty(Id))
            {
            _logger.LogCritical($"2 Id is {Id}");
                return new UnauthorizedResult();
            }

            _logger.LogCritical($"2-2 Id is {Id}");

            AuthId = Id;
        }
        catch (Exception e)
        {
            _logger.LogCritical("1" + e.ToString());
            return new UnauthorizedResult();
        }

        _logger.LogCritical("i should fucking work");
        _logger.LogCritical($"3 AuthId is {AuthId}");

        // get user data json string from redis
        var str = (await _cache.Redis.StringGetAsync(AuthId)).ToString();
            _logger.LogCritical($"4 str is {str}");

        if (String.IsNullOrEmpty(str))
        {
            return new UnauthorizedResult();
        }

        // try parse the json string
        Auth? Data;

        try
        {
            Data = JsonSerializer.Deserialize<Auth>(str);

            if (Data is null)
            {
            _logger.LogCritical($"5 Data is {Data}");
                return new UnauthorizedResult();

            }
        }
        catch (Exception e)
        {
            _logger.LogError("2" + e.ToString());
            return new UnauthorizedResult();
        }

        // get user Agent
        var currentAgent = GetUserAgent(ctx);


        _logger.LogCritical($"currentAgent is {currentAgent} and Data.Agent is {Data.Agent}");

        // invalidated user session if IP or Agent changed
        if (Data.Agent != currentAgent)
        {
            await _cache.Redis.KeyDeleteAsync(AuthId);
            ctx.Response.Cookies.Delete("auth");
            _logger.LogCritical($"6 Data is {Data}");
            return new RedirectResult("/auth/login");
        }

        // check if user role match one of the list of roles allowed to do this action
        if (!roles.Contains(Data.role))
        {
            _logger.LogCritical($"7 roles is {roles[0].ToString()}");
            return new UnauthorizedResult();
        }
        // done
        return null;
    }

    public string GetUserAgent(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(HeaderNames.UserAgent, out var userAgent))
        {
            return userAgent.ToString();
        }
        return "not-found";
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
