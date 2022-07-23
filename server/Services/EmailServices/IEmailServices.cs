using server.Models.api;

namespace server.Services.EmailServices
{
    public interface IEmailServices
    {
         Task SendEmail(EmailDto req); 
    }
}
