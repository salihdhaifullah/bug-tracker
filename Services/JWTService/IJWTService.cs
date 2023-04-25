namespace Buegee.Services.JWTService
{
    public interface IJWTService
    {
        public string GenerateJwt(long milleSecondes, List<Claim> claims);
        public (Dictionary<string, string>? payload, VerifyJwtErrors? error) VerifyJwt(string jwt);
    }
}
