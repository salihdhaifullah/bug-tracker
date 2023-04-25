using System.ComponentModel.DataAnnotations;

namespace Buegee.Dto;

public class ForgetPasswordDto {
    [EmailAddress(ErrorMessage = "invalid email address"),
    Required(ErrorMessage = "email is required"),
    MaxLength(100, ErrorMessage = "max length is 100 characters")]
    public string Email {get; set;} = "";
}
