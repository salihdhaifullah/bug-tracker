namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public void LogIn(string Id, HttpContext ctx);
    public Task SetSessionAsync<T>(string sessionName, TimeSpan sessionTimeSpan, T payload, HttpContext ctx);
    public Task<T?> GetSessionAsync<T>(string sessionName, HttpContext ctx) where T : class;
    public Task DeleteSessionAsync(string sessionName, HttpContext ctx);

}
