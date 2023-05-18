using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buegee.Models;

[Table("team")]
public class Team {
    [Key, Column("id")]
    public int Id { get; set; }

    [Required, ForeignKey("Owner"), Column("owner")]
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    [Column("members")]
    public ICollection<User> Members {get; set;} = null!;
}
