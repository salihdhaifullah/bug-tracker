using server.Data;
using Microsoft.EntityFrameworkCore;
using server.Services.EmailServices;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<Context>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Connection")));

builder.Services.AddScoped<IEmailServices, EmailServices>();
builder.Services.AddScoped<IJsonWebToken, JsonWebToken>();
builder.Services.AddScoped<IPasswordServices, PasswordServices>();

// default Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();