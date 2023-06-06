using Buegee.Services.JWTService;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Buegee.Utils.Attributes;

public class Authorized : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var jwt = context.HttpContext.RequestServices.GetService<IJWTService>();

        if (jwt is null)
        {
            context.Result = HttpResult.InternalServerError();
            return;
        }

        if (!context.HttpContext.Request.Cookies.TryGetValue("auth", out var token) || String.IsNullOrEmpty(token))
        {
            context.Result = HttpResult.UnAuthorized("you need to login to do this action");
            return;
        }

        try
        {
            var data = jwt.VerifyJwt(token);

            if (!data.TryGetValue("id", out var idStr) || String.IsNullOrEmpty(idStr) || !int.TryParse(idStr, out var id))
            {
                context.Result = HttpResult.UnAuthorized("you need to login to do this action");
                return;
            }

            context.HttpContext.Items["userId"] = id;
        }
        catch (Exception)
        {
            context.Result = HttpResult.UnAuthorized("you need to login to do this action");
            return;
        }

        await next();
    }

}
