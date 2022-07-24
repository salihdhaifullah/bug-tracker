namespace server.Models.db
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string HashPassword { get; set; } = String.Empty;
        public string PasswordSalt { get; set; } = String.Empty;
        public DateTime? VerifiedAt { get; set; }
        public bool IsVerified { get; set; } = false;
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
    }
}
