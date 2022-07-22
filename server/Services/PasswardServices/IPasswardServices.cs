namespace server.Services.PasswardServices
{
    public interface IPasswardServices
    {
        public void CreatePasswardHash(string passward, out string passwardHash, out string passwardSalt);
        public bool VerifyPasswardHash(string passward, string passwardHash, string passwardSalt);
    }
}
