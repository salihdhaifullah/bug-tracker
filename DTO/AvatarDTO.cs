using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class AvatarDTO
{
    [JsonPropertyName("contentType")]
    [Required(ErrorMessage = "content-type is required")]
    [RegularExpression(@"^(jpeg|png|svg|webp)$", ErrorMessage = "un-valid content type")]
    public string ContentType { get; set; } = null!;

    // base64
    [JsonPropertyName("data")]                     // 2mb in binary and 2.7mb in base64
    [Required(ErrorMessage = "image is required"), MaxLength(2796202, ErrorMessage = "sorry, maximum size of profile image is 2.0 MB")]
    public string Data { get; set; } = null!;
}
