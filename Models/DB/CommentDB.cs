using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models.DB;

[Table("comment")]
public class CommentDB
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, Column("markdown"), StringLength(500)]
    public string Markdown { get; set; } = null!;

    [Column("files")]
    public List<FileDB> Files { get; set; } = null!;

    [Required, ForeignKey("Ticket"), Column("ticket")]
    public int TicketId { get; set; }
    public TicketDB Ticket { get; set; } = null!;

    [Required, ForeignKey("User"), Column("user")]
    public int UserId { get; set; }
    public UserDB User { get; set; } = null!;
}
