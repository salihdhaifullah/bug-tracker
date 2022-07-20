namespace server.Data
{
    public class UserDataContex : DbContext
    {
        public UserDataContex(DbContextOptions<UserDataContex> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseSerialColumns();
        }
        public DbSet<UserData> UsersData { get; set; }

    }
}
