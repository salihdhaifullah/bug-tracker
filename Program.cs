using Buegee.Middlewares;
using Buegee.Services.AuthService;
using Buegee.Services.CryptoService;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;
using Buegee.Services.EmailService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<DataContext>();
builder.Services.AddSingleton<IJWTService, JWTService>();
builder.Services.AddSingleton<ICryptoService, CryptoService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();
builder.Services.AddSingleton<IAuthService, AuthService>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();
app.UseMiddleware<StatusCodeMiddleware>();
app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();
