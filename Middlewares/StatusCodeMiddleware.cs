namespace Buegee.Middlewares;

public class StatusCodeMiddleware
{
    private readonly RequestDelegate _next;
    public StatusCodeMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);

        if (!String.IsNullOrEmpty(Path.GetExtension(context.Request.Path))) return;

        switch (context.Response.StatusCode)
        {
            case 404:
                context.Response.Redirect("/not-found");
                break;
            case 403:
                context.Response.Redirect("/forbidden");
                break;
            case 401:
                context.Response.Redirect("/unauthorized");
                break;
            case 500:
                context.Response.Redirect("/error");
                break;
            default:
                break;
        }
    }
}
