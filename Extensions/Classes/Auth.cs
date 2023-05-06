using Buegee.Extensions.Enums;
namespace Buegee.Extensions.Classes;

public class Auth
{
    public Roles role { get; set; } = Roles.REPORTER;
    public int Id { get; set; }
    public string Agent { get; set; } = null!;
}
