using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.db
{
    public class UserRole
    {
         #pragma warning disable CS8618
        public int Id { get; set; }
        [Required, ForeignKey("UserId")]
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public string Role { get; set; } = Roles.Developer;
        [Required, ForeignKey("ProjectId")]
        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
    }
}
