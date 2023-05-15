using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.Models.VM;

public class AccountVerificationVM
{
    [JsonPropertyName("code")]
    [Required(ErrorMessage = "verification code is required"),
    StringLength(6, MinimumLength = 6, ErrorMessage = "verification code must be 6 characters long"),
    RegularExpression("^[0-9]+$", ErrorMessage = "un-valid verification code")]
    public string Code { get; set; } = "";
}
