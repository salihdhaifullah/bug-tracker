using server.Models.db;

namespace server.Data
{
    public class Context : DbContext
    {
        #pragma warning disable CS8618
        public Context(DbContextOptions<Context> options) : base(options) {}
        protected override void OnModelCreating(ModelBuilder modelBuilder) { modelBuilder.UseSerialColumns();
        
        // modelBuilder.Entity<User>()
        //     .HasOne(a => a.Avatar)
        //     .WithOne(a => a.Creator)
        //     .HasForeignKey<Fille>(c => c.CreatorId);
        }
        
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Ticket> Tickets  { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Fille> Filles { get; set; }
    }
}