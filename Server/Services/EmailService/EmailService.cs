using System.Net;
using System.Net.Mail;
using System.Text;

namespace Buegee.Services.EmailService;
public class EmailService : IEmailService
{
    private SmtpClient _smtpClient;
    private readonly string _appEmail;
    private readonly string _appPassword;

    public EmailService(IConfiguration config)
    {
        var isAppPassword = config.GetSection("EmailApp").GetValue<string>("Password");
        var isAppEmail = config.GetSection("EmailApp").GetValue<string>("Email");

        if (string.IsNullOrEmpty(isAppEmail)) throw new Exception("email service is not configured");
        if (string.IsNullOrEmpty(isAppPassword)) throw new Exception("email service is not configured");

        _appPassword = isAppPassword;
        _appEmail = isAppEmail;

        _smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(_appEmail, _appPassword)
        };
    }

    private Task Mail(string to, string subject, string template)
    {
        var stringBuilder = new StringBuilder(template);

        var message = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: subject,
            body: stringBuilder.ToString()
        )
        {
            IsBodyHtml = true,
            Priority = MailPriority.High
        };

        return _smtpClient.SendMailAsync(message);
    }

    public void Verification(string to, string name, string code)
    {
        Mail(to, "activate your account", new VerificationEmail(name, code).Get());
    }

    public void ResetPassword(string to, string name, string code)
    {
        Mail(to, "reset your password", new VerificationEmail(name, code).Get());
    }
}
