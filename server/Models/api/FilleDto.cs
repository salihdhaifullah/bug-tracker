using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class FilleDto
    {
        [Required]
        public string Description { get; set; } = String.Empty;
        [Required]
        public IFormFile file { get; set; } = null;
        public IFormFile fileTwo { get; set; } = null;
    }
}
