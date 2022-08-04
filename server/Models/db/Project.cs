﻿
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.db
{
    public class Project
    {
        #pragma warning disable CS8618
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsClosed { get; set; } = false;
        public DateTime? ClosedAt { get; set; }
        [ForeignKey("TicketsId")]
        public List<int> TicketsId { get; set; } = new() {};
        public virtual ICollection<Ticket>? Tickets { get; set; }
    }
}
