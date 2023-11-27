using System.Text.Json.Serialization;

namespace Buegee.DTO;

public class ContentDTO {

    [JsonPropertyName("markdown")]
    public string Markdown { get; set; } = null!;

    [JsonPropertyName("files")]
    public List<Image> Files {get; set;} = null!;
}

public class Image {
    [JsonPropertyName("base64")]
    public string Base64 {get; set;} = null!;
    [JsonPropertyName("previewUrl")]
    public string PreviewUrl {get; set;} = null!;
}
