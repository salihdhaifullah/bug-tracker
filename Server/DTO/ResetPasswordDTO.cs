using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class ResetPasswordDTO
{
    [JsonPropertyName("code")]
    [Required(ErrorMessage = "verification code is required"),
    StringLength(6, MinimumLength = 6, ErrorMessage = "verification code must be 6 characters long"),
    RegularExpression("^[0-9]+$", ErrorMessage = "un-valid verification code")]
    public string Code { get; set; } = null!;
    [JsonPropertyName("newPassword")]

    [Required(ErrorMessage = "password is required"),
    MinLength(8, ErrorMessage = "minimum length of password is 8 character")]
    public string NewPassword { get; set; } = null!;
}
