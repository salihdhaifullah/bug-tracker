namespace server.Services.JsonWebToken
{
    public interface IJsonWebToken
    {
        public string GenerateToken(int id, string? role);
        public int? VerifyToken(string token);
        public string GenerateRefreshToken(int id); 
    }
}
