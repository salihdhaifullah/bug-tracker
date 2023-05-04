using Buegee.Extensions.Classes;

namespace Buegee.Services.JWTService;

public interface IJWTService
{
    public string GenerateJwt(TimeSpan Age, List<Claim> claims);
    public Dictionary<string, string> VerifyJwt(string jwt);
}
