using server.Models;

namespace server.Services.EmailServices
{
    public interface IEmailServices
    {
         Task SendEmail(EmailDto req); 
    }
}
