using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class LoginDTO
{
    [JsonPropertyName("email")]

    [EmailAddress(ErrorMessage = "un-valid email address"),
    Required(ErrorMessage ="email address is required"),
    MaxLength(100, ErrorMessage ="maximum length of email address is 100 character")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("password")]

    [Required(ErrorMessage = "password is required"),
    MinLength(8, ErrorMessage = "minimum length of password is 8 character")]
    public string Password { get; set; } = null!;
}


