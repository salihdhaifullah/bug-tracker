namespace server.Models.db
{
    public class Permissions
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectId { get; set; }
        public Project Project { get; set; }

    }
}
