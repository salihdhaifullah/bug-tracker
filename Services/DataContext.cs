using Microsoft.EntityFrameworkCore;
using Buegee.Models.DB;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) {}
    public DbSet<UserDB> Users { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("name=ConnectionStrings:DefaultConnection");
    }
}
