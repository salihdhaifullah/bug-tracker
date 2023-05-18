using Microsoft.AspNetCore.Mvc;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public void LogIn(int Id, HttpContext ctx);
    public IActionResult? CheckPermissions(HttpContext ctx, out int id);
    public IActionResult? CheckPermissions(HttpContext ctx);
    public bool TryGetUser(HttpContext ctx, out Auth? user);
    public Task SetSessionAsync<T>(string sessionName, TimeSpan sessionTimeSpan, T payload, HttpContext ctx);
    public Task<T?> GetSessionAsync<T>(string sessionName, HttpContext ctx) where T : class;
    public Task DeleteSessionAsync(string sessionName, HttpContext ctx);

}
