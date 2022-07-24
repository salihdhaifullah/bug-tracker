namespace server.Services.PasswordServices
{
    public interface IPasswordServices
    {
        public void CreatePasswordHash(string password, out string passwordHash, out string passwordSalt);
        public bool VerifyPasswordHash(string password, string passwordHash, string passwordSalt);
    }
}
