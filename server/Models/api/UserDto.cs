using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class UserSinginDto
    {
        [Required]
        public string FirstName { get; set; } = String.Empty;
        [Required]
        public string LastName { get; set; } = String.Empty;
        [Required, MinLength(8)]
        public string Email { get; set; } = String.Empty;
        [Required, MinLength(6)]
        public string Password { get; set; } = String.Empty;
    }

    public class UserLoginDto
    {
        [Required, MinLength(8)]
        public string Email { get; set; } = String.Empty;
        [Required, MinLength(6)]
        public string Password { get; set; } = String.Empty;
    }
}
