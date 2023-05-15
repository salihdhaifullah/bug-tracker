using System.Net;
using System.Net.Mail;
using System.Text;

namespace Buegee.Services.EmailService;
public class EmailService : IEmailService
{
    private readonly string? _appEmail;
    private readonly string? _appPassword;
    private SmtpClient _smtpClient;
    private readonly string _verificationEmailHtml;
    private readonly string _resetPasswordHtml;
    private readonly string _roleChangedHtml;

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
        _roleChangedHtml = File.ReadAllText("./Emails/role-changed.html");
    }

    public Task sendVerificationEmail(string to, string name, string code)
    {
        var stringBuilder = new StringBuilder(_verificationEmailHtml);
        stringBuilder.Replace("${name}", name);
        stringBuilder.Replace("${code}", code);

        var massage = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "activate your account",
            body: stringBuilder.ToString()
        );

        massage.IsBodyHtml = true;
        massage.Priority = MailPriority.High;

        return _smtpClient.SendMailAsync(massage);
    }

    public Task resetPasswordEmail(string to, string name, string code)
    {
        var stringBuilder = new StringBuilder(_resetPasswordHtml);

        stringBuilder.Replace("${name}", name);
        stringBuilder.Replace("${code}", code);

        var massage = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "reset your password",
            body: stringBuilder.ToString()
        );

        massage.IsBodyHtml = true;
        massage.Priority = MailPriority.High;

        return _smtpClient.SendMailAsync(massage);
    }

    public Task roleChangedEmail(string to, string name, string role1, string role2)
    {
        var stringBuilder = new StringBuilder(_roleChangedHtml);

        stringBuilder.Replace("${name}", name);
        stringBuilder.Replace("${role1}", role1);
        stringBuilder.Replace("${role2}", role2);

        var massage = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "your role changed",
            body: stringBuilder.ToString()
        );

        massage.IsBodyHtml = true;
        massage.Priority = MailPriority.High;

        return _smtpClient.SendMailAsync(massage);
    }
}
