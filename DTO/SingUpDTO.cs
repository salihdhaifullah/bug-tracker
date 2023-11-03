using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class SingUpDTO
{
    [JsonPropertyName("firstName")]
    [Required(ErrorMessage = "first name is required"),
    MaxLength(50, ErrorMessage = "maximum length of first name is 50 character")]
    public string FirstName { get; set; } = null!;


    [JsonPropertyName("lastName")]
    [Required(ErrorMessage = "last name is required"),
      MaxLength(50, ErrorMessage = "maximum length of last name is 50 character")]
    public string LastName { get; set; } = null!;


    [JsonPropertyName("email")]
    [EmailAddress(ErrorMessage = "un-valid email address"),
    Required(ErrorMessage = "email address is required"),
    MaxLength(100, ErrorMessage = "maximum length of email address is 100 character")]
    public string Email { get; set; } = null!;


    [JsonPropertyName("password")]
    [Required(ErrorMessage = "password is required"),
    MinLength(8, ErrorMessage = "minimum length of password is 8 character")]
    public string Password { get; set; } = null!;
}
