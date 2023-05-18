using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Models;

[Table("project")]
[Index(nameof(Name), nameof(TeamId), IsUnique = true)]
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

    [Column("tickets")]
    public ICollection<Ticket> Tickets { get; set; } = null!;

    [Column("activities")]
    public ICollection<Activity> Activities { get; set; } = null!;

    [Required, ForeignKey("Team"), Column("team")]
    public int TeamId {get; set;}
    public Team Team { get; set; } = null!;

    [ForeignKey("Description"), Column("description")]
    public int? DescriptionId { get; set; }
    public Content? Description { get; set; }
}
