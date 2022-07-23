namespace server.Models.db
{
    public class Labels
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string Color { get; set; } = String.Empty;
    }
}
