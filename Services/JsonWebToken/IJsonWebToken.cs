namespace bug_tracker.Services.JsonWebToken
{
    public interface IJsonWebToken
    {
        public string GenerateJwtToken(int userId, string role);
        public (int?, string?) VerifyJwtToken(string token);
    }
}
