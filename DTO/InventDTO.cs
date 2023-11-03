using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class InventDTO
{
    [JsonPropertyName("inventedId"), Required(ErrorMessage = "user to invent is required"), IdValidation(ErrorMessage = "un-valid Invented id")]
    public string InventedId {get; set;} = null!;

    [JsonPropertyName("role"), Required(ErrorMessage = "role is required"), RegularExpression(@"^(tester|project_manger|developer)$", ErrorMessage = "un-valid role")]
    public string Role { get; set; } = null!;
}
