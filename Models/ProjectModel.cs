using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Ticket> Tickets {get; set;}
        [Required]
        [ForeignKey("ProjectMangerId")]
        public int ProjectMangerId { get; set; }
        public virtual User ProjectManger { get; set; }
    }
}
