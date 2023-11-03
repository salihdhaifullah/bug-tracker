namespace Buegee.Services.JWTService;

public interface IJWTService
{
    public string GenerateJwt(TimeSpan age, Dictionary<string, string> claims);
    public Dictionary<string, string> VerifyJwt(string jwt);
}
