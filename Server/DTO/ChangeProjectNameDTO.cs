using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Buegee.Utils.Attributes;

namespace Buegee.DTO;

public class ChangeProjectNameDTO {
    [JsonPropertyName("name")]
    [Required(ErrorMessage ="project name is required"),
    MaxLength(100, ErrorMessage ="maximum length of project name is 100 character")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "project id is required"), JsonPropertyName("projectId"), IdValidation(ErrorMessage = "un-valid project id")]
    public string ProjectId {get; set;} = null!;
}
