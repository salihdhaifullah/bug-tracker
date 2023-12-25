using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Utils.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class ProjectRoleAttribute : Attribute, IAsyncActionFilter
{
    private readonly Role[] _roles;
    public ProjectRoleAttribute(params Role[] roles) {
        _roles = roles;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {

        var _auth = context.HttpContext.RequestServices.GetService<IAuthService>() ?? throw new NullReferenceException("IAuthService is null");
        var _ctx = context.HttpContext.RequestServices.GetService<DataContext>() ?? throw new NullReferenceException("DataContext is null");

        _auth.TryGetId(context.HttpContext.Request, out string? userId);

        if (context.RouteData.Values.TryGetValue("projectId", out var projectIdObj) && projectIdObj != null)
        {

            var projectId = projectIdObj.ToString();

            var havePermission = await _ctx.Projects
                .Where(p => p.Id == projectId)
                .AnyAsync(p => p.Members.Any(m => m.UserId == userId && _roles.Contains(m.Role)));

            if (!havePermission)
            {
                context.Result = HttpResult.Forbidden("you don't have permission to do this action", redirectTo: "/403");
                return;
            }
        }

        await next();
    }
}
