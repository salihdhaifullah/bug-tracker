using Buegee.Extensions.Enums;

namespace Buegee.Extensions.Classes;

public class AuthorizationResult
{
    public Roles? Role { get; set; } = null;
    public int? Id { get; set; } = null;
    public bool IsAuthorized { get; set; } = false;
    public bool IsAuthorizedRole { get; set; } = false;
}
