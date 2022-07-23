using Microsoft.EntityFrameworkCore;
using server.Models.db;
using Task = server.Models.db.Task;

namespace server.Data
{
    public class Context : DbContext
    {
        #pragma warning disable CS8618
        public Context(DbContextOptions<Context> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseSerialColumns();
        }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Replie> Replies { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
