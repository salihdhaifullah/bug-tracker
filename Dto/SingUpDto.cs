using System.ComponentModel.DataAnnotations;

namespace Buegee.Dto;

public class SingUpDto
{
    [Required, MinLength(2), MaxLength(50)]
    public string FirstName { get; set; } = "";
    [Required, MinLength(2), MaxLength(50)]
    public string LastName { get; set; } = "";
    [EmailAddress, Required, MaxLength(100)]
    public string Email { get; set; } = "";
    [Required, MinLength(8)]
    public string Password { get; set; } = "";
}
