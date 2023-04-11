using bug_tracker.Models;
using Microsoft.EntityFrameworkCore;

namespace bug_tracker.Services
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration) {
             Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options) {
            options.UseNpgsql(Configuration.GetConnectionString("MainDatabase"));
        }

        public DbSet<User> Users { get; set; }
    }
}


