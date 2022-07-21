using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using server.Models;

namespace server.Services.EmailServices
{
	public class EmailServices : IEmailServices
	{
		private readonly IConfiguration _configuration;

		public EmailServices(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public void SendEmail(EmailDto req)
		{
			var email = new MimeMessage();
			email.From.Add(MailboxAddress.Parse(_configuration.GetSection("EmailUser").Value));
			email.To.Add(MailboxAddress.Parse(req.To));
			email.Subject = req.Subject;
			email.Body = new TextPart(TextFormat.Html) { Text = req.Body };

			using var smtp = new SmtpClient();
			smtp.Connect(_configuration.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
			smtp.Authenticate(_configuration.GetSection("EmailUser").Value, _configuration.GetSection("EmailPassword").Value);
			smtp.Send(email);
			smtp.Disconnect(true);
			
		}

	}
}
