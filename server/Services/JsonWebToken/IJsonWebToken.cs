namespace server.Services.JsonWebToken
{
    public interface IJsonWebToken
    {
        public string GenerateToken(int id);
    }
}
