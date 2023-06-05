using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("project")]
[Index(nameof(Name), nameof(OwnerId), IsUnique = true)]
public class Project
{
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, StringLength(100), Column("name")]
    public string Name { get; set; } = null!;

    [Required, Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required, Column("is_private")]
    public bool IsPrivate { get; set; } = false;

    [Required, ForeignKey("Owner"), Column("owner_id")]
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    [Required, ForeignKey("Content"), Column("content_id")]
    public int ContentId { get; set; }
    public Content Content { get; set; } = null!;

    [Column("activities")]
    public List<Activity> Activities { get; set; } = new List<Activity>();

    [Column("members")]
    public List<Member> Members { get; set; } = new List<Member>();

    [Column("tickets")]
    public List<Ticket> Tickets { get; set; } = new List<Ticket>();
}
