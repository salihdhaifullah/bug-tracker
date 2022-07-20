namespace server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public int Age { get; set; }
        public string Email { get; set; } = String.Empty;
        public string HashPassward { get; set; } = String.Empty;
        public string  PasswardSalt { get; set; } = String.Empty;
        public string Gander { get; set; } = String.Empty;
        public string? VerifictionToken { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? PasswardRestToken { get; set; }
        public DateTime? RestTokenExpires { get; set; }
        public string[]? RestPasswardQustions { get; set; }
        public string[]? RestPasswardAnswar { get; set; }
    }
}
