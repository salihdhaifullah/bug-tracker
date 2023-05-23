using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class CreateProjectDTO {
    [JsonPropertyName("name")]

    [Required(ErrorMessage ="project name is required"),
    MaxLength(100, ErrorMessage ="maximum length of project name  is 100 character")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("isPrivate")]
    public bool IsPrivate { get; set; } = false;
}

