using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class UserSinginReq
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

    public class UserLoginReq
    {
        [Required, MinLength(8)]
        public string Email { get; set; } = String.Empty;
        [Required, MinLength(6)]
        public string Password { get; set; } = String.Empty;
    }


    public class UserResponse
    {
        public string token { get; set; }
        public string email { get; set; }
        public string fullName { get; set; }

    }

}
