namespace server.Models
{
    public class Languages
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Icon { get; set; } = String.Empty;
        public string Color { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
    }
}
