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
        var isAppPassword = config.GetSection("EmailService").GetValue<string>("AppPassword");
        var isAppEmail = config.GetSection("EmailService").GetValue<string>("AppEmail");

        if (string.IsNullOrEmpty(isAppPassword) || string.IsNullOrEmpty(isAppEmail))
        throw new Exception("email service is not configured");

        _appPassword = isAppPassword;
        _appEmail = isAppEmail;

        _smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(_appEmail, _appPassword)
        };
    }

    private Task mail(string to, string subject, string template)
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
        mail(to, "activate your account", new VerificationEmail(name, code, DateTime.UtcNow.ToString("dd-MM-yyyy hh:mm")).Get());
    }

    public void ResetPassword(string to, string name, string code)
    {
        mail(to, "reset your password", new VerificationEmail(name, code, DateTime.UtcNow.ToString("dd-MM-yyyy hh:mm")).Get());
    }
}
