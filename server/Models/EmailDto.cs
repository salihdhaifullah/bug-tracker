namespace server.Models
{
    public class EmailDto
    {
        public string To { get; set; } = String.Empty;
        public string Subject { get; set; } = String.Empty;
        public string Body { get; set; } = String.Empty;
    }
}
