using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bug_tracker.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; } //  task, bug, feature
        public string Priority { get; set; } // low, medium, high, critical
        /*
            New: The bug has been reported but not yet assigned or verified
            Active: The bug has been verified and assigned to a developer
            In Progress: The developer is working on fixing the bug
            Resolved: The developer has fixed the bug and marked it as resolved
            Closed: The tester has verified that the bug is fixed and marked it as closed
        */
        public string Status { get; set; } // New, Active, In Progress, Resolved, Closed
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public List<Attachment> Attachments { get; set; }
        public List<Comment> Comments {get; set;}

        [Required]
        [ForeignKey("AssignedToId")]
        public int AssignedToId { get; set; }
        public virtual User AssignedTo { get; set; }

        [Required]
        [ForeignKey("ReporterId")]
        public int ReporterId { get; set; }
        public virtual User Reporter { get; set; }

        [Required]
        [ForeignKey("CreatorId")]
        public int CreatorId { get; set; }
        public virtual User Creator { get; set; }

    }
}


