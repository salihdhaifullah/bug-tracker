using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Services.CryptoService;
using Buegee.Services.DataService;
using Buegee.Services.EmailService;
using Buegee.Services.FirebaseService;
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
builder.Services.AddSingleton<IFirebaseService, FirebaseService>();
builder.Services.AddSingleton<IDataService, DataService>();

var app = builder.Build();

if (app.Environment.IsDevelopment() && args.Contains("seed"))
using (var scope = app.Services.CreateScope()) await new Seed(scope).SeedAsync();

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
