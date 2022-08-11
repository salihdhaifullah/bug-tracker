namespace server.Models.api
{
    public class RoleDto
    {
        public string Role { get; set; } = Roles.Developer;
        public List<int> UsersId { get; set; }
    }
}
