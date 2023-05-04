using Microsoft.EntityFrameworkCore;
using Buegee.Models.DB;

namespace Buegee.Services;

public class DataContext : DbContext
{
    private readonly IConfiguration _configuration;
    public DataContext(IConfiguration configuration, DbContextOptions<DataContext> options) : base(options) {
        _configuration = configuration;
    }

    public DbSet<UserDB> Users { get; set; } = null!;
    public DbSet<FileDB> Files { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var isFound = _configuration.GetSection("ConnectionStrings").GetValue<string>("DefaultConnection");
        if (isFound is null) throw new Exception("Default Connection String Are Not Configured");
        optionsBuilder.UseNpgsql(isFound);
    }
}
