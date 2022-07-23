using Microsoft.EntityFrameworkCore;
using server.Models.db;

namespace server.Data
{
    public class UserDataContex : DbContext
    {
        #pragma warning disable CS8618
        public UserDataContex(DbContextOptions<UserDataContex> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseSerialColumns();
        }
        public DbSet<User> Users { get; set; }


    }
}
