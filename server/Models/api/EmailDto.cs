using System.ComponentModel.DataAnnotations;

namespace server.Models.api
{
    public class EmailDto
    {
        [Required]
        public string To { get; set; } = String.Empty;
        [Required]
        public string Subject { get; set; } = String.Empty;
        [Required]
        public string Body { get; set; } = String.Empty;
    }
}
