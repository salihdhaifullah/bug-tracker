using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class TransferProjectOwnerShipDTO {
    [Required(ErrorMessage = "member id is required"), JsonPropertyName("memberId"), IdValidation(ErrorMessage = "un-valid member id")]
    public string MemberId { get; set; } = null!;
    
    [Required(ErrorMessage = "project id is required"), JsonPropertyName("projectId"), IdValidation(ErrorMessage = "un-valid project id")]
    public string ProjectId {get; set;} = null!;
}
