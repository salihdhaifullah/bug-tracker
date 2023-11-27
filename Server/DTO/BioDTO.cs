using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class BioDTO
{
    [JsonPropertyName("bio")]
    [Required(ErrorMessage = "bio is required"),
    MaxLength(100, ErrorMessage = "maximum length of bio is 100 character")]
    public string Bio { get; set; } = null!;
}
