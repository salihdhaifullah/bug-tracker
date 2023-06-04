using Buegee.Models;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Data;

public class DataContext : DbContext
{
    private readonly IConfiguration _configuration;
    public DataContext(IConfiguration configuration, DbContextOptions<DataContext> options) : base(options) { _configuration = configuration; }

    public virtual DbSet<User> Users { get; set; } = null!;
    public virtual DbSet<Project> Projects { get; set; } = null!;
    public virtual DbSet<Ticket> Tickets { get; set; } = null!;
    public virtual DbSet<Comment> Comments { get; set; } = null!;
    public virtual DbSet<Activity> Activities { get; set; } = null!;
    public virtual DbSet<Content> Contents { get; set; } = null!;
    public virtual DbSet<ContentUrl> ContentUrls { get; set; } = null!;
    public virtual DbSet<Member> Members { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var isFound = _configuration.GetSection("ConnectionStrings").GetValue<string>("DefaultConnection");

        if (isFound is null) throw new Exception("Default Connection String Are Not Configured");

        optionsBuilder.UseNpgsql(isFound);
    }
}
