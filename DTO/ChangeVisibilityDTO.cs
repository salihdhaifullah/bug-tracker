using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class ChangeVisibilityDTO
{
    [Required(ErrorMessage = "project id is required"), JsonPropertyName("projectId"), IdValidation(ErrorMessage = "un-valid project id")]
    public string ProjectId { get; set; } = null!;

    [Required(ErrorMessage = "state is required"), JsonPropertyName("isPrivate")]
    public bool IsPrivate { get; set; }
}
