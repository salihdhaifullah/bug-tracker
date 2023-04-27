using System.ComponentModel.DataAnnotations;

namespace Buegee.Models.VM;

public class AccountVerificationVM
{
    [Required(ErrorMessage = "verification code is required"),
    StringLength(6, MinimumLength = 6, ErrorMessage = "verification code must be 6 characters long")]
    public string Code { get; set; } = "";
}
