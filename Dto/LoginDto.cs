using System.ComponentModel.DataAnnotations;

namespace Buegee.Dto;

public class LoginDto
{
    [EmailAddress, Required, MaxLength(100)]
    public string Email { get; set; } = "";
    [Required, MinLength(8)]
    public string Password { get; set; } = "";
}

