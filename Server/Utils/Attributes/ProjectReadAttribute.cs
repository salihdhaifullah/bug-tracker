using Buegee.Models;
using Buegee.Services.AuthService;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Utils.Attributes;

public class ProjectReadAttribute : Attribute, IAsyncActionFilter
{
    private readonly IQueryable<Project> _project;
    public ProjectReadAttribute(IQueryable<Project> project) {
        _project = project;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var _auth = context.HttpContext.RequestServices.GetService<IAuthService>();
        if (_auth is null) throw new NullReferenceException("IAuthService is null");

        _auth.TryGetId(context.HttpContext.Request, out string? userId);
        if (!await _project.AnyAsync(p => !p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId))) {
            context.Result = HttpResult.Forbidden("cant access this project", redirectTo: "/403");
            return;
        }

        await next();
    }
}
