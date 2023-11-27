using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class TicketStatusDTO {
    [JsonPropertyName("status"), Required(ErrorMessage = "ticket status is required")]
    [RegularExpression(@"^(review|active|in_progress|resolved|closed)$", ErrorMessage = "un-valid ticket status")]
    public string Status { get; set; } = null!;


    [JsonPropertyName("id"), Required(ErrorMessage = "ticket id is required")]
    [IdValidation(ErrorMessage = "un-valid ticket id")]
    public string TicketId {get; set;}  = null!;
}


