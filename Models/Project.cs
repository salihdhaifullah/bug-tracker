using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("project")]
[Index(nameof(OwnerId), nameof(Name), IsUnique = true)]
public class Project
{

    [Key, Column("id")]
    public int Id { get; set; }

    [Required, StringLength(100), Column("name")]
    public string Name { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("is_private")]
    public bool IsPrivate { get; set; } = false;

    [Required, ForeignKey("Owner"), Column("owner")]
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    [Column("members")]
    public ICollection<Member> Members { get; set; } = null!;

    [Column("tickets")]
    public ICollection<Ticket> Tickets { get; set; } = null!;

    [Column("activities")]
    public ICollection<Activity> Activities { get; set; } = null!;

    [ForeignKey("Description"), Column("description")]
    public int? DescriptionId { get; set; }
    public Content? Description { get; set; }
}
