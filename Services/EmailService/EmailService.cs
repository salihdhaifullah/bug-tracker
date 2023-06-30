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
    private readonly string _ticketAssignedToYouHtml;

    public EmailService(IConfiguration config)
    {
        _appPassword = config.GetSection("EmailService").GetValue<string>("AppPassword");
        _appEmail = config.GetSection("EmailService").GetValue<string>("AppEmail");

        if (_appPassword is null || _appEmail is null) throw new Exception("email service is not configured");


        _smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(_appEmail, _appPassword)
        };

        _verificationEmailHtml = File.ReadAllText("./Emails/verification-email.html");
        _resetPasswordHtml = File.ReadAllText("./Emails/reset-password.html");
        _invitationToProjectHtml = File.ReadAllText("./Emails/invitation-to-project.html");
        _ticketAssignedToYouHtml = File.ReadAllText("./Emails/ticket-assigned-to-you.html");
    }

    private record Item(string name, string value);

    private Task mail(string to, string subject, string template, List<Item> items)
    {
        var stringBuilder = new StringBuilder(template);

        foreach (var item in items) stringBuilder.Replace(item.name, item.value);

        stringBuilder.Replace("${date}", DateTime.UtcNow.ToString("dd-MM-yyyy hh:mm"));

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

    public Task Verification(string to, string name, string code)
    {
        var items = new List<Item>(2);
        items.Add(new Item("${name}", name));
        items.Add(new Item("${code}", code));

        return mail(to, "activate your account", _verificationEmailHtml, items);
    }

    public Task ResetPassword(string to, string name, string code)
    {
        var items = new List<Item>(2);
        items.Add(new Item("${name}", name));
        items.Add(new Item("${code}", code));

        return mail(to, "reset your password", _resetPasswordHtml, items);
    }

    public Task Invitation(string to, string name, string projectName, Role role, string inventerName, string url)
    {
        var items = new List<Item>(5);
        items.Add(new Item("${name}", name));
        items.Add(new Item("${project_name}", projectName));
        items.Add(new Item("${role}", role.ToString()));
        items.Add(new Item("${inventer}", inventerName));
        items.Add(new Item("${url}", url));

        return mail(to, "invitation to project", _invitationToProjectHtml, items);
    }

    public Task TicketAssignation(string to, string name, string ticketName, TicketType ticketType, Status ticketStatus, Priority ticketPriority)
    {
        var items = new List<Item>(5);
        items.Add(new Item("${name}", name));
        items.Add(new Item("${ticket_name}", ticketName));
        items.Add(new Item("${ticket_type}", ticketType.ToString()));
        items.Add(new Item("${ticket_status}", ticketStatus.ToString()));
        items.Add(new Item("${ticket_priority}", ticketPriority.ToString()));

        return mail(to, "ticket assigned to you", _ticketAssignedToYouHtml, items);
    }
}
