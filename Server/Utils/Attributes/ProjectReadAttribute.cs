using Buegee.Data;
using Buegee.Services.AuthService;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Utils.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class ProjectReadAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {

        var _auth = context.HttpContext.RequestServices.GetService<IAuthService>() ?? throw new NullReferenceException("IAuthService is null");
        var _ctx = context.HttpContext.RequestServices.GetService<DataContext>() ?? throw new NullReferenceException("DataContext is null");

        _auth.TryGetId(context.HttpContext.Request, out string? userId);

        if (context.RouteData.Values.TryGetValue("projectId", out var projectIdObj) && projectIdObj != null)
        {

            var projectId = projectIdObj.ToString();

            var canViewProject = await _ctx.Projects
                .Where(p => p.Id == projectId)
                .Select(p => !p.IsPrivate || p.Members.Any(m => userId != null && m.UserId == userId))
                .FirstOrDefaultAsync();

            if (!canViewProject)
            {
                context.Result = HttpResult.Forbidden("you can not access this project", redirectTo: "/403");
                return;
            }
        }

        await next();
    }
}
