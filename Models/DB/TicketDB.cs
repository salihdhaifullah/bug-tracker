using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models.DB;
public class TicketDB
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Type { get; set; } = null!; //  task, bug, feature
    public string Priority { get; set; } = null!; // low, medium, high, critical
    /*
        New: The bug has been reported but not yet assigned or verified
        Active: The bug has been verified and assigned to a developer
        In Progress: The developer is working on fixing the bug
        Resolved: The developer has fixed the bug and marked it as resolved
        Closed: The tester has verified that the bug is fixed and marked it as closed
    */
    public string Status { get; set; }  = null!; // New, Active, In Progress, Resolved, Closed
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public List<FileDB> Files { get; set; } = null!;
    public List<CommentDB> Comments { get; set; } = null!;

    [Required]
    [ForeignKey("AssignedToId")]
    public int AssignedToId { get; set; }
    public virtual UserDB AssignedTo { get; set; } = null!;

    [Required]
    [ForeignKey("ReporterId")]
    public int ReporterId { get; set; }
    public virtual UserDB Reporter { get; set; } = null!;

    [Required]
    [ForeignKey("CreatorId")]
    public int CreatorId { get; set; }
    public virtual UserDB Creator { get; set; } = null!;
}

