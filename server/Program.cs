using server.Data;
using Microsoft.EntityFrameworkCore;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<Context>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Connection")));

builder.Services.AddScoped<IJsonWebToken, JsonWebToken>();
builder.Services.AddScoped<IPasswordServices, PasswordServices>();

// default Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => options.AddPolicy("Policy", policy => 
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200")
));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Policy");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();