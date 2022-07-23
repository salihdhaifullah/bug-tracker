namespace server.Models.db
{
    public class User
    {
        public int Id { get; set; } = default;
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string HashPassward { get; set; } = String.Empty;
        public string PasswardSalt { get; set; } = String.Empty;
        public DateTime? VerifiedAt { get; set; } = default;
        public bool IsVerified { get; set; } = false;
        public DateTime CreateAt { get; set; } = default;
        public Roles Role { get; set; }
    }
}
