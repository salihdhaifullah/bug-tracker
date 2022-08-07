namespace server.Models.api
{
    public class RoleReq
    {
        public string Role { get; set; } = Roles.Developer;
        public List<int> UsersId { get; set; }
    }
}
