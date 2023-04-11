using System.Text;
using bug_tracker.Services;
using bug_tracker.Services.HashCompar;
using bug_tracker.Services.JsonWebToken;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddSpaStaticFiles(config => config.RootPath = "dist");


// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAnyOrigin",
//     builder =>
//     {
//         builder.SetIsOriginAllowed(origin => true)
//                .AllowAnyHeader()
//                .AllowAnyMethod()
//                .AllowCredentials();
//     });
// });

builder.Services.AddDbContext<DataContext>();
builder.Services.AddScoped<IJsonWebToken, JsonWebToken>();
builder.Services.AddScoped<IHashCompar, HashCompar>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetValue<string>("SecretKey")))
    };
}
);

var app = builder.Build();


app.UseRouting();
app.MapControllers();
app.UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    // app.UseCors("AllowAnyOrigin");
    app.UseSpa(builder =>
    {
       builder.UseProxyToSpaDevelopmentServer("http://localhost:5173/");
    });
}
else
{
    app.UseSpaStaticFiles();
    app.UseSpa(builder => {});
}



app.Run();
