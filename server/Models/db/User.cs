using System.ComponentModel.DataAnnotations.Schema;

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
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public string Role { get; set; } = Roles.Developer;
        public string AvatarUrl { get; set; } = String.Empty;
        public string AvatarName { get; set; } = String.Empty;
    }
}
