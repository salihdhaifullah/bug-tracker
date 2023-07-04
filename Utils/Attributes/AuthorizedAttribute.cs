using Buegee.Services.JWTService;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Buegee.Utils.Attributes;

public class AuthorizedAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var jwt = context.HttpContext.RequestServices.GetService<IJWTService>();
        if (jwt is null) throw new NullReferenceException("IJWTService is null");

        if (!context.HttpContext.Request.Cookies.TryGetValue("auth", out var token) || String.IsNullOrEmpty(token))
        {
            context.Result = HttpResult.UnAuthorized();
            return;
        }

        try
        {
            if (!jwt.VerifyJwt(token).TryGetValue("id", out var id) || String.IsNullOrEmpty(id) || id.Length != 26)
            {
                context.Result = HttpResult.UnAuthorized();
                return;
            }
        }
        catch (Exception)
        {
            context.Result = HttpResult.UnAuthorized();
            return;
        }

        await next();
    }
}
