using System.ComponentModel.DataAnnotations;

namespace Buegee.Models.VM;

public class LoginVM
{
    [EmailAddress, Required, MaxLength(100)]
    public string Email { get; set; } = "";
    [Required, MinLength(8)]
    public string Password { get; set; } = "";
}

