using System.ComponentModel.DataAnnotations;

namespace server.Data
{
    public class UserData
    {
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; } = String.Empty;
        [Required]
        public string LastName { get; set; } = String.Empty;
        [Required]
        public int Age { get; set; }
        [Required]
        public string Email { get; set; } = String.Empty;
        [Required]
        public string HashPassward { get; set; } = String.Empty;
        [Required]
        public string PasswardSalt { get; set; } = String.Empty;
        [Required]
        public string Gander { get; set; } = String.Empty;
        public DateTime? VerifiedEmailAt { get; set; }
        [MinLength(3)]
        public string[]? RestPasswardQustions { get; set; }
        [MinLength(3)]
        public string[]? RestPasswardAnswar { get; set; }
    }
}
