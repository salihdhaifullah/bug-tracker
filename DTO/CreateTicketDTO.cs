using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class CreateTicketDTO {

    [JsonPropertyName("name")]
    [Required(ErrorMessage ="name is required"),
    MaxLength(100, ErrorMessage ="maximum length of ticket name is 100 characters"),
    MinLength(3, ErrorMessage = "minium length of ticket name is 3 characters")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("type"), Required(ErrorMessage = "ticket type is required")]
    [RegularExpression(@"^(bug|feature)$", ErrorMessage = "un-valid ticket type")]
    public string Type { get; set; } = null!;

    [JsonPropertyName("priority"), Required(ErrorMessage = "ticket priority is required")]
    [RegularExpression(@"^(low|medium|high|critical)$", ErrorMessage = "un-valid ticket priority")]
    public string Priority { get; set; } = null!;

    [JsonPropertyName("status"), Required(ErrorMessage = "ticket status is required")]
    [RegularExpression(@"^(review|active|in_progress|resolved|closed)$", ErrorMessage = "un-valid ticket status")]
    public string Status { get; set; } = null!;

    [JsonPropertyName("assignedToEmail"), EmailAddress(ErrorMessage = "un-valid email address"), StringLength(26)]
    public string? AssignedToEmail {get; set;}
}
