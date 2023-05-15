using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Services.CryptoService;
using Buegee.Services.EmailService;
using Buegee.Services.JWTService;
using Buegee.Services.RedisCacheService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSpaStaticFiles(config => config.RootPath = "dist");
builder.Services.AddDbContext<DataContext>();
builder.Services.AddSingleton<IJWTService, JWTService>();
builder.Services.AddSingleton<ICryptoService, CryptoService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();
builder.Services.AddSingleton<IAuthService, AuthService>();

var app = builder.Build();

if (app.Environment.IsDevelopment() && args.Contains("seed"))
{
    await new Seed(
            (DataContext)app.Services.GetService(typeof(DataContext))!,
            (ICryptoService)app.Services.GetService(typeof(ICryptoService))!
            ).SeedAsync();
}

app.UseRouting();
#pragma warning disable ASP0014
app.UseEndpoints(builder => builder.MapDefaultControllerRoute());
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSpa(builder => builder.UseProxyToSpaDevelopmentServer("http://localhost:5173/"));
}
else
{
    app.UseSpaStaticFiles();
    app.UseSpa(_ => {});
}

app.Run();
