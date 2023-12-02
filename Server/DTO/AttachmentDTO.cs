using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class AttachmentDTO
{
    [JsonPropertyName("contentType")]
    [Required(ErrorMessage = "content-type is required")]
    public string ContentType { get; set; } = null!;

    [JsonPropertyName("data"), Required(ErrorMessage = "file is required")]
    public string Data { get; set; } = null!;

    [Required(ErrorMessage = "ticket id is required"), JsonPropertyName("ticketId"), IdValidation(ErrorMessage = "un-valid ticket id")]
    public string TicketId { get; set; } = null!;

    [JsonPropertyName("title")]
    [Required(ErrorMessage = "title is required"),
    MaxLength(100, ErrorMessage = "maximum length of attachment title is 100 characters"),
    MinLength(3, ErrorMessage = "minimum length of attachment title is 3 characters")]
    public required string Title { get; set; } = null!;
}
