using server.Models;

namespace server.Services.EmailServices
{
    public interface IEmailServices
    {
        void SendEmail(EmailDto req); 
    }
}
