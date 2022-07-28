namespace server.Models.db
{
    public class Role
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public int UserId { get; set; } 
        public string UserEmail { get; set; } = String.Empty;
        public bool IsManager { get; set; } = false;
        public bool IsAdmin { get; set; } = false;
        public bool IsDeveloper { get; set; } = true;
    }
}