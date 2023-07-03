using Microsoft.AspNetCore.Mvc.Filters;

namespace Buegee.Utils.Attributes;

public class BodyValidationAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ModelState.IsValid)
        {
            var errorMessage = context.ModelState.Values.SelectMany(v => v.Errors).FirstOrDefault()?.ErrorMessage;
            context.Result = HttpResult.BadRequest(errorMessage);
            return;
        }

        await next();
    }
}
