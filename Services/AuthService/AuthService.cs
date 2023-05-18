using System.Text.Json;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Buegee.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

using static Buegee.Utils.Utils;

namespace Buegee.Services.AuthService;

public record Auth(int Id, string Agent);

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;
    private readonly IRedisCacheService _cache;

    public AuthService(IJWTService jwt, IRedisCacheService cache)
    {
        _jwt = jwt;
        _cache = cache;
    }

    public void LogIn(int id, HttpContext ctx)
    {
        // a year
        var age = new TimeSpan(365, 0, 0, 0);

        var claims = new Dictionary<string, string>();
        claims["id"] = id.ToString();
        claims["agent"] = GetUserAgent(ctx);

        // set auth cookie token
        ctx.Response.Cookies.Append("auth", _jwt.GenerateJwt(age, claims), CookieConfig(age));
    }


    public bool TryGetUser(HttpContext ctx, out Auth? user)
    {
        user = null;

        // is auth cookie found
        if (!ctx.Request.Cookies.TryGetValue("auth", out var token) || String.IsNullOrEmpty(token)) return false;

        try
        {
            // if token un-valid VerifyJwt method will throw
            var data = _jwt.VerifyJwt(token);

            // get id
            if (!data.TryGetValue("id", out var idStr) || String.IsNullOrEmpty(idStr) || !int.TryParse(idStr, out var userId)) return false;

            // get agent
            if (!data.TryGetValue("agent", out var agent) || String.IsNullOrEmpty(agent)) return false;


            user = new Auth(userId, agent);
        }
        catch (Exception)
        {
            return false;
        }

        return true;
    }


    public IActionResult? CheckPermissions(HttpContext ctx, out int id)
    {
        id = 0;

        if (!TryGetUser(ctx, out Auth? user)) return new HttpResult()
                        .IsOk(false)
                        .StatusCode(401)
                        .Message("you need to login to do this action")
                        .Get();

        // invalidated user token if user agent changed
        if (user?.Agent != GetUserAgent(ctx))
        {
            ctx.Response.Cookies.Delete("auth");
            return new HttpResult()
                        .IsOk(false)
                        .StatusCode(401)
                        .Message("you need to login to do this action")
                        .Get();
        }

        id = user.Id;

        // user is good
        return null;
    }

    public IActionResult? CheckPermissions(HttpContext ctx)
    {

        if (!TryGetUser(ctx, out Auth? user)) return new HttpResult()
                        .IsOk(false)
                        .StatusCode(401)
                        .Message("you need to login to do this action")
                        .Get();

        // invalidated user token if user agent changed
        if (user?.Agent != GetUserAgent(ctx))
        {
            ctx.Response.Cookies.Delete("auth");
            return new HttpResult()
                        .IsOk(false)
                        .StatusCode(401)
                        .Message("you need to login to do this action")
                        .Get();
        }

        // user is good
        return null;
    }

    public async Task SetSessionAsync<T>(string sessionName, TimeSpan sessionTimeSpan, T payload, HttpContext ctx)
    {
        var sessionId = Guid.NewGuid().ToString();

        ctx.Response.Cookies.Append(sessionName, sessionId, CookieConfig(sessionTimeSpan));

        await _cache.Redis.StringSetAsync(sessionId, JsonSerializer.Serialize<T>(payload), sessionTimeSpan);
    }

    public async Task<T?> GetSessionAsync<T>(string sessionName, HttpContext ctx) where T : class
    {
        if (!ctx.Request.Cookies.TryGetValue(sessionName, out var sessionId)) return null;

        string? jsonSession = await _cache.Redis.StringGetAsync(sessionId);

        if (jsonSession is null) return null;

        return JsonSerializer.Deserialize<T>(jsonSession);
    }

    public async Task DeleteSessionAsync(string sessionName, HttpContext ctx)
    {
        if (!ctx.Request.Cookies.TryGetValue(sessionName, out var sessionId)) return;

        ctx.Response.Cookies.Delete(sessionName);

        await _cache.Redis.KeyDeleteAsync(sessionId);
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
