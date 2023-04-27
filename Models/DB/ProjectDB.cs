using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models.DB;

public class ProjectDB
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<TicketDB> Tickets { get; set; } = null!;
    [Required]
    [ForeignKey("ProjectMangerId")]
    public int ProjectMangerId { get; set; }
    public virtual UserDB ProjectManger { get; set; } = null!;
}
