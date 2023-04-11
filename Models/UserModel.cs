using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace bug_tracker.Models
{
    [Index("Email", IsUnique = true)]
    [Index("FirstName", "LastName", "Role")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Role { get; set; } = "reporter"; // developer, projectManger, admin, reporter
        /*
            Developer: view the assigned issues, update their status, add comments, attach files, and mark them as resolved or closed.
            Project Manager: reports bugs. create new tickets, assign them to developers, add details, and verify the fixes, prioritize the issues.
            Admin: create and edit projects, users, roles, and reports.
            Reporter: submit new issues, comment on existing issues.
        */
        public bool Verified { get; set; } = false;
        public string? Bio { get; set; }
        public byte[]? Image {get; set;}
        // public List<Comment> Comments {get; set;}
    }
}
