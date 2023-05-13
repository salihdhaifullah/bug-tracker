using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.Models.VM;

public class LoginVM
{
    [JsonPropertyName("email")]

    [RegularExpression(@"^(([^<>()[\]\\.,;:\s@\""]+(\.[^<>()[\]\\.,;:\s@\""]+)*)|(\"".+\""))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$", ErrorMessage = "un-valid email address"),
    Required(ErrorMessage ="email address is required"),
    MaxLength(100, ErrorMessage ="maximum length of email address is 100 character")]
    public string Email { get; set; } = "";

    [JsonPropertyName("password")]

    [Required(ErrorMessage = "password is required"),
    MinLength(8, ErrorMessage = "minimum length of password is 8 character")]
    public string Password { get; set; } = "";
}


