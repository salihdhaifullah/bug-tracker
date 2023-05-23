
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;


public class ProfileContentDTO {

    [JsonPropertyName("markdown")]
    [Required(ErrorMessage = "markdown is required"),
    MaxLength(100, ErrorMessage = "maximum length of markdown is 100 character")]
    public string markdown { get; set; } = null!;


    [JsonPropertyName("markdown")]
    [Required(ErrorMessage = "markdown is required"),
    MaxLength(100, ErrorMessage = "maximum length of markdown is 100 character")]
    public Dictionary<string, string> Images = null!;
}
