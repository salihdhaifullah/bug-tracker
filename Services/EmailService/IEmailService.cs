using Buegee.Utils.Enums;

namespace Buegee.Services.EmailService;

public interface IEmailService
{
    public Task Verification(string to, string name, string code);
    public Task ResetPassword(string to, string name, string code);
    public Task Invitation(string to, string name, string projectName, Role role, string inventerName, string url);
}
