using Buegee.Data;
using Buegee.Services.AuthService;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Utils.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class ProjectMemberAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {

        var _auth = context.HttpContext.RequestServices.GetService<IAuthService>() ?? throw new NullReferenceException("IAuthService is null");
        var _ctx = context.HttpContext.RequestServices.GetService<DataContext>() ?? throw new NullReferenceException("DataContext is null");

        _auth.TryGetId(context.HttpContext.Request, out string? userId);

        if (context.RouteData.Values.TryGetValue("projectId", out var projectIdObj) && projectIdObj != null)
        {

            var projectId = projectIdObj.ToString();

            var isMember = await _ctx.Projects
                .Where(p => p.Id == projectId)
                .AnyAsync(p => p.Members.Any(m => m.UserId == userId));

            if (!isMember)
            {
                context.Result = HttpResult.Forbidden("you can not access this project", redirectTo: "/403");
                return;
            }
        }

        await next();
    }
}
