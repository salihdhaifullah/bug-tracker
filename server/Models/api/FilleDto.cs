using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class FilleDto
    {
        [Required]
        public string Description { get; set; } = String.Empty;
        [Required]
        public IFormFile file { get; set; } = null;
    }

    public class FileUpdateDto {
        [Required]
        public string Description { get; set; } = String.Empty;
    }

}
