using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class InviteDTO
{
    [JsonPropertyName("invitedId"), Required(ErrorMessage = "user to invite is required"), IdValidation(ErrorMessage = "un-valid Invited id")]
    public string InvitedId {get; set;} = null!;

    [JsonPropertyName("role"), Required(ErrorMessage = "role is required"), RegularExpression(@"^(tester|project_manger|developer)$", ErrorMessage = "un-valid role")]
    public string Role { get; set; } = null!;
}
