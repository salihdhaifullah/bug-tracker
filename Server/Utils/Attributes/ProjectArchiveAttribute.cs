using Buegee.Data;
using Buegee.Services.AuthService;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Utils.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class ProjectArchiveAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {

        var _auth = context.HttpContext.RequestServices.GetService<IAuthService>() ?? throw new NullReferenceException("IAuthService is null");
        var _ctx = context.HttpContext.RequestServices.GetService<DataContext>() ?? throw new NullReferenceException("DataContext is null");

        _auth.TryGetId(context.HttpContext.Request, out string? userId);

        if (context.RouteData.Values.TryGetValue("projectId", out var projectIdObj) && projectIdObj != null)
        {

            var projectId = projectIdObj.ToString();

            var isArchived = await _ctx.Projects
                .Where(p => p.Id == projectId)
                .AnyAsync(p => p.IsReadOnly);

            if (isArchived)
            {
                context.Result = HttpResult.BadRequest("this project is archived");
                return;
            }
        }

        await next();
    }
}
