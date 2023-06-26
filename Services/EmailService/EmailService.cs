using System.Net;
using System.Net.Mail;
using System.Text;
using Buegee.Utils.Enums;

namespace Buegee.Services.EmailService;
public class EmailService : IEmailService
{
    private readonly string? _appEmail;
    private readonly string? _appPassword;
    private SmtpClient _smtpClient;
    private readonly string _verificationEmailHtml;
    private readonly string _resetPasswordHtml;
    private readonly string _invitationToProjectHtml;

    public EmailService(IConfiguration config)
    {
        _appPassword = config.GetSection("EmailService").GetValue<string>("AppPassword");
        _appEmail = config.GetSection("EmailService").GetValue<string>("AppEmail");

        if (_appPassword is null || _appEmail is null)
        {
            throw new Exception("email service is not configured");
        }

        _smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(_appEmail, _appPassword)
        };

        _verificationEmailHtml = File.ReadAllText("./Emails/verification-email.html");
        _resetPasswordHtml = File.ReadAllText("./Emails/reset-password.html");
        _invitationToProjectHtml = File.ReadAllText("./Emails/invitation-to-project.html");
    }


    public Task Verification(string to, string name, string code)
    {
        var stringBuilder = new StringBuilder(_verificationEmailHtml);
        stringBuilder.Replace("${name}", name);
        stringBuilder.Replace("${code}", code);

        var message = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "activate your account",
            body: stringBuilder.ToString()
        );

        message.IsBodyHtml = true;
        message.Priority = MailPriority.High;

        return _smtpClient.SendMailAsync(message);
    }

    public Task ResetPassword(string to, string name, string code)
    {
        var stringBuilder = new StringBuilder(_resetPasswordHtml);

        stringBuilder.Replace("${name}", name);
        stringBuilder.Replace("${code}", code);

        var message = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "reset your password",
            body: stringBuilder.ToString()
        );

        message.IsBodyHtml = true;
        message.Priority = MailPriority.High;

        return _smtpClient.SendMailAsync(message);
    }

    public Task Invitation(string to, string name, string projectName, Role role, string inventerName, string url)
    {
        var stringBuilder = new StringBuilder(_invitationToProjectHtml);

        stringBuilder.Replace("${name}", name);
        stringBuilder.Replace("${project_name}", projectName);
        stringBuilder.Replace("${role}", role.ToString());
        stringBuilder.Replace("${inventer}", inventerName);
        stringBuilder.Replace("${url}", url);

        var message = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "invitation to project",
            body: stringBuilder.ToString()
        );

        message.IsBodyHtml = true;
        message.Priority = MailPriority.High;

        return _smtpClient.SendMailAsync(message);
    }
}
