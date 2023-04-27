using System.ComponentModel.DataAnnotations;

namespace Buegee.Models.VM;

public class ResetPasswordVM {
    [Required, MinLength(6), MaxLength(6)]
    public string Code {get; set;} = "";
    [Required, MinLength(8)]
    public string NewPassword { get; set; } = "";
}
