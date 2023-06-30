using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class InventDTO
{
    [JsonPropertyName("inventedId"), Required(ErrorMessage = "user to invent is required"), StringLength(26), MinLength(26)]
    public string InventedId {get; set;} = null!;

    [JsonPropertyName("role"), Required(ErrorMessage = "role is required"), RegularExpression(@"^(tester|project_manger|developer)$", ErrorMessage = "un-valid role")]
    public string Role { get; set; } = null!;
}
