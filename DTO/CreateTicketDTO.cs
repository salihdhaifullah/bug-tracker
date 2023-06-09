using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class CreateTicketDTO {

    [JsonPropertyName("name")]
    [Required(ErrorMessage ="name is required"),
    MaxLength(100, ErrorMessage ="maximum length of name is 100 character")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("type")]
    [RegularExpression(@"^(bug|feature)$", ErrorMessage = "un-valid ticket type")]
    public string? Type { get; set; }

    [JsonPropertyName("priority")]
    [RegularExpression(@"^(low|medium|high|critical)$", ErrorMessage = "un-valid ticket priority")]
    public string? Priority { get; set; }

    [JsonPropertyName("status")]
    [RegularExpression(@"^(review|active|in_progress|resolved|closed)$", ErrorMessage = "un-valid ticket status")]
    public string? Status { get; set; }

    [JsonPropertyName("assignedToId"), MinLength(26), MaxLength(26)]
    public string? AssignedToId {get; set;}
}
