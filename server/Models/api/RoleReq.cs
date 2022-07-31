namespace server.Models.api
{
    public class RoleReq
    {
        public string Role { get; set; } = Roles.Developer;
        public int UserId { get; set; }
        public int ProjectId { get; set; }
    }
}
