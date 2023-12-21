using System.Text.Json;
using Buegee.Data;
using Buegee.Models;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Buegee.Utils;
using Buegee.Utils.Enums;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IJWTService _jwt;
    private readonly IRedisCacheService _cache;
    private readonly DataContext _ctx;
    public AuthService(IJWTService jwt, DataContext ctx, IRedisCacheService cache)
    {
        _jwt = jwt;
        _ctx = ctx;
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

    public bool TryGetId(HttpRequest request, out string? Id)
    {
        Id = null;
        try
        {
            Id = GetId(request);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public string GetId(HttpRequest request)
    {
        if (!request.Cookies.TryGetValue("auth", out var token) || String.IsNullOrEmpty(token)) throw new Exception("token is not found");
        if (!_jwt.VerifyJwt(token).TryGetValue("id", out var id) || String.IsNullOrEmpty(id) || id.Length != 26) throw new Exception("un-valid token");
        return id;
    }

    public async Task<bool> CanUserAccessProject(IQueryable<Project> projects, string? userId)
    {
        return await projects.AnyAsync(p => !p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId));
    }

    public bool CanUserAccessProject(Project project, string? userId)
    {
        return !project.IsPrivate || project.Members.Any(m => userId != null && m.UserId == userId);
    }

    public async Task<bool> CanUserMutateProject(IQueryable<Project> projects, string userId, List<Role> roles)
    {
        return await projects.AnyAsync(p => p.Members.Any(m => m.UserId == userId && roles.Any(r => r == m.Role)));
    }

    public bool CanUserMutateProject(Project project, string userId, List<Role> roles)
    {
        return project.Members.Any(m => m.UserId == userId && roles.Any(r => r == m.Role));
    }
}
