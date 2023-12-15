using Buegee.Utils.Enums;

namespace Buegee.Services.EmailService;

public interface IEmailService
{
    public void Verification(string to, string name, string code);
    public void ResetPassword(string to, string name, string code);
    public void TicketAssignation(string to, string name, string ticketName, TicketType ticketType, Status ticketStatus, Priority ticketPriority);
}
