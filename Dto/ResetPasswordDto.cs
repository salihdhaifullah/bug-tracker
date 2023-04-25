using System.ComponentModel.DataAnnotations;

namespace Buegee.Dto;

public class ResetPasswordDto {
    [Required, MinLength(6), MaxLength(6)]
    public string Code {get; set;} = "";
    [Required, MinLength(8)]
    public string NewPassword { get; set; } = "";
}
