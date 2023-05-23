using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class TitleDTO
{
    [JsonPropertyName("title")]
    [Required(ErrorMessage = "title is required"),
    MaxLength(100, ErrorMessage = "maximum length of title is 100 character")]
    public string Title { get; set; } = null!;
}
