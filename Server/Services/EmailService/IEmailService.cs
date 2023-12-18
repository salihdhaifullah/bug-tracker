namespace Buegee.Services.EmailService;

public interface IEmailService
{
    public void Verification(string to, string name, string code);
    public void ResetPassword(string to, string name, string code);
}
