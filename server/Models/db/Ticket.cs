using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.db
{
    public class Ticket
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public bool IsInProgress { get; set; } = false;
        public bool IsCompleted { get; set; } = false;
        public bool IsOpen { get; set; } = false;
        public bool IsNew { get; set; } = true;
        public bool IsBug { get; set; } = false;
        public bool IsFeature { get; set; } = true;
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        [Required, ForeignKey("AssigneeToId")]
        public int AssigneeToId { get; set; }
        public virtual User AssigneeTo { get; set; }
        [Required, ForeignKey("SubmitterId")]
        public int SubmitterId { get; set; }
        public virtual User Submitter { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        [Required, ForeignKey("ProjectId")]
        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
        [ForeignKey("CommentsId")]
        public List<int> CommentsId { get; set; } = new() {};
        public virtual ICollection<Comment>? Comments { get; set; }
        [ForeignKey("FilesId")]
        public List<int> FilesId { get; set; } = new() {};
        public virtual ICollection<Fille>? Files { get; set; }
    }

}
