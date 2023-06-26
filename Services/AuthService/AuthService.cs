using System.Text.Json;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Buegee.Utils;

namespace Buegee.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;
    private readonly IRedisCacheService _cache;

    public AuthService(IJWTService jwt, IRedisCacheService cache)
    {
        _jwt = jwt;
        _cache = cache;
    }

    public void LogIn(string id, HttpContext ctx)
    {
        var age = new TimeSpan(365, 0, 0, 0);
        var claims = new Dictionary<string, string>();
        claims["id"] = id;
        ctx.Response.Cookies.Append("auth", _jwt.GenerateJwt(age, claims), Helper.CookieConfig(age));
    }

    public async Task SetSessionAsync<T>(string sessionName, TimeSpan sessionTimeSpan, T payload, HttpContext ctx)
    {
        var sessionId = Guid.NewGuid().ToString();
        ctx.Response.Cookies.Append(sessionName, sessionId, Helper.CookieConfig(sessionTimeSpan));
        await _cache.Redis.StringSetAsync(sessionId, JsonSerializer.Serialize<T>(payload), sessionTimeSpan);
    }

    public async Task<T?> GetSessionAsync<T>(string sessionName, HttpContext ctx) where T : class
    {
        if (!ctx.Request.Cookies.TryGetValue(sessionName, out var sessionId)) return null;

        string? jsonSession = await _cache.Redis.StringGetAsync(sessionId);

        if (String.IsNullOrEmpty(jsonSession)) return null;

        return JsonSerializer.Deserialize<T>(jsonSession);
    }

    public async Task DeleteSessionAsync(string sessionName, HttpContext ctx)
    {
        if (!ctx.Request.Cookies.TryGetValue(sessionName, out var sessionId)) return;

        ctx.Response.Cookies.Delete(sessionName);

        await _cache.Redis.KeyDeleteAsync(sessionId);
    }
}
