using System.Net;
using System.Net.Mail;
using System.Text;

namespace Buegee.Services.EmailService;

public class EmailService : IEmailService
{
    private readonly string? AppEmail;
    private readonly string? AppPassword;
    private SmtpClient smtpClient;
    private readonly string verificationEmailHtml;
    private readonly string resetPasswordHtml;
    private readonly string RoleChangedHtml;

    public EmailService(IConfiguration config)
    {
        AppPassword = config.GetSection("EmailService").GetValue<string>("AppPassword");
        AppEmail = config.GetSection("EmailService").GetValue<string>("AppEmail");

        if (AppPassword is null || AppEmail is null)
        {
            throw new Exception("email service is not configured");
        }

        smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(AppEmail, AppPassword)
        };

        verificationEmailHtml = File.ReadAllText("./wwwroot/asset/verification-email.html");
        resetPasswordHtml = File.ReadAllText("./wwwroot/asset/reset-password.html");
        RoleChangedHtml = File.ReadAllText("./wwwroot/asset/role-changed.html");
    }

    public Task sendVerificationEmail(string to, string name, string code)
    {
        var BS = new StringBuilder(verificationEmailHtml);
        BS.Replace("${name}", name);
        BS.Replace("${code}", code);

        var massage = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "activate your account",
            body: BS.ToString()
        );

        massage.IsBodyHtml = true;
        massage.Priority = MailPriority.High;

        return smtpClient.SendMailAsync(massage);
    }

    public Task resetPasswordEmail(string to, string name, string code)
    {
        var BS = new StringBuilder(resetPasswordHtml);

        BS.Replace("${name}", name);
        BS.Replace("${code}", code);

        var massage = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "reset your password",
            body: BS.ToString()
        );

        massage.IsBodyHtml = true;
        massage.Priority = MailPriority.High;

        return smtpClient.SendMailAsync(massage);
    }

    public Task roleChangedEmail(string to, string name, string role1, string role2)
    {
        var BS = new StringBuilder(resetPasswordHtml);

        BS.Replace("${name}", name);
        BS.Replace("${role1}", role1);
        BS.Replace("${role2}", role2);

        var massage = new MailMessage(
            from: "Team@Buegee.com",
            to: to,
            subject: "your role changed",
            body: BS.ToString()
        );

        massage.IsBodyHtml = true;
        massage.Priority = MailPriority.High;

        return smtpClient.SendMailAsync(massage);
    }
}
