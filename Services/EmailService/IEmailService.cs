namespace Buegee.Services.EmailService;

public interface IEmailService {
 public Task sendVerificationEmail(string to, string name, string code);
 public Task resetPasswordEmail(string to, string name, string code);
}
