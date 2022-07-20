namespace server.Models
{
    public class UserREG
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public int Age { get; set; }
        public string Email { get; set; } = String.Empty;
        public string Passward { get; set; } = String.Empty;
    }
}
