namespace server.Models
{
    public class User
    {
        public int Id { get; set; } = default;
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string HashPassward { get; set; } = String.Empty;
        public string  PasswardSalt { get; set; } = String.Empty;
        public DateTime? VerifiedAt { get; set; } = default;
        public DateTime CreateAt { get; set; } = default;
    }
}
