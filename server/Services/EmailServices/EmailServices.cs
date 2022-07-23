using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using server.Models.api;

namespace server.Services.EmailServices
{
	public class EmailServices : IEmailServices
	{
		private readonly IConfiguration _configuration;

		public EmailServices(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public async Task SendEmail(EmailDto req)
		{
			var email = new MimeMessage();
			email.From.Add(MailboxAddress.Parse(_configuration.GetSection("EmailUser").Value));
			email.To.Add(MailboxAddress.Parse(req.To));
			email.Subject = req.Subject;
			email.Body = new TextPart(TextFormat.Html) { Text = req.Body };

			using var smtp = new SmtpClient();
             
			await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
			await smtp.AuthenticateAsync(_configuration.GetSection("EmailUser").Value, _configuration.GetSection("EmailPassword").Value);
			await smtp.SendAsync(email);
			await smtp.DisconnectAsync(true);
			
		}

	}
}
