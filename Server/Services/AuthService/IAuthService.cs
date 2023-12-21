using Buegee.Models;
using Buegee.Utils.Enums;

namespace Buegee.Services.AuthService;

public interface IAuthService
{
    public void LogIn(string Id, HttpContext ctx);
    public Task SetSessionAsync<T>(string sessionName, TimeSpan sessionTimeSpan, T payload, HttpContext ctx);
    public Task<T?> GetSessionAsync<T>(string sessionName, HttpContext ctx) where T : class;
    public Task DeleteSessionAsync(string sessionName, HttpContext ctx);
    public bool TryGetId(HttpRequest request, out string? Id);
    public string GetId(HttpRequest request);
    public Task<bool> CanUserAccessProject(IQueryable<Project> projects, string? userId);
    public bool CanUserAccessProject(Project project, string? userId);
    public Task<bool> CanUserMutateProject(IQueryable<Project> projects, string userId, List<Role> roles);
    public bool CanUserMutateProject(Project project, string userId, List<Role> roles);
}
