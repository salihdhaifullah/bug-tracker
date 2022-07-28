using Microsoft.EntityFrameworkCore;
using server.Models.db;

namespace server.Data
{
    public class Context : DbContext
    {
        #pragma warning disable CS8618
        public Context(DbContextOptions<Context> options) : base(options) {}
        protected override void OnModelCreating(ModelBuilder modelBuilder) { modelBuilder.UseSerialColumns(); }
        
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Ticket> Tickets  { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
