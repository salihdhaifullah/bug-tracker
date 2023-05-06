using Buegee.Extensions.Middlewares;
using Buegee.Services.AuthService;
using Buegee.Services.CryptoService;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Buegee.Services.EmailService;
using Buegee.Services;
using Buegee.Extensions.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<DataContext>();
builder.Services.AddSingleton<IJWTService, JWTService>();
builder.Services.AddSingleton<ICryptoService, CryptoService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();
builder.Services.AddSingleton<IAuthService, AuthService>();

var app = builder.Build();

if (args.Contains("seed"))
{
    await new Seed(
            (DataContext)app.Services.GetService(typeof(DataContext))!,
            (ICryptoService)app.Services.GetService(typeof(ICryptoService))!
            ).SeedAsync();
}

app.UseStaticFiles();
app.UseRouting();
app.UseMiddleware<StatusCodeMiddleware>();
app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();
