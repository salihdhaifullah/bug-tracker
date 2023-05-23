using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class UpdateNameDTO {
    [JsonPropertyName("firstName")]
    [Required(ErrorMessage = "first name is required"),
    MaxLength(50, ErrorMessage = "maximum length of first name is 50 character")]
    public string FirstName { get; set; } = null!;


    [JsonPropertyName("lastName")]
    [Required(ErrorMessage = "last name is required"),
      MaxLength(50, ErrorMessage = "maximum length of last name is 50 character")]
    public string LastName { get; set; } = null!;
}
