using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class UpdateAttachmentDTO
{
    [JsonPropertyName("contentType")]
    public string? ContentType { get; set; }

    [JsonPropertyName("data")]
    public string? Data { get; set; }

    [JsonPropertyName("title")]
    [MaxLength(100, ErrorMessage = "maximum length of attachment title is 100 characters"),
    MinLength(3, ErrorMessage = "minimum length of attachment title is 3 characters")]
    public string? Title { get; set; }
}
