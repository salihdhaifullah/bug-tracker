using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class ChangeRoleDTO {
    [JsonPropertyName("role"), Required(ErrorMessage = "role is required")]
    [RegularExpression(@"^(project_manger|developer)$", ErrorMessage = "un-valid role")]
    public string Role { get; set; } = null!;
}
