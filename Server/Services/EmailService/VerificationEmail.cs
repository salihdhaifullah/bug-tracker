namespace Buegee.Services.EmailService;

class VerificationEmail
{
    private readonly string _name;
    private readonly string _date;
    private readonly string _code;

    public VerificationEmail(string name, string code, string date) {
        _name = name;
        _date = date;
        _code = code;
    }

    public string Get() {
        return @$"
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
                <title>Buegee — account verification</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        margin: 10px 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #eff1f3;
                        border: 1px solid #cccccc;
                    }}
                    .header {{
                        padding: 20px;
                        text-align: center;
                        background-color: #eff1f3;
                        color: #ffb100;
                    }}
                    .content {{
                        padding: 20px;
                    }}
                    .title {{
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #363636;
                    }}
                    .message {{
                        font-size: 16px;
                        text-align: center;
                        line-height: 1.5em;
                        margin-bottom: 20px;
                        color: #363636;
                    }}
                    .end {{
                        font-size: 16px;
                        text-align: start;
                        line-height: 1.5em;
                        margin-bottom: 4px;
                        color: #363636;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Verify your email address</h1>
                    </div>
                    <div class='content'>
                        <p class='title'>Hello, ${_name}</p>
                        <p class='message'>Thank you for signing up with us.</p>
                        <h1>Verification code: '${_code}'</h1>
                        <p class='message'>This code will expire after 30 minutes.</p>
                        <p class='message'>If you did not sign up with us, please ignore this email.</p>
                        <p class='end'>date ${_date}<br> Sincerely,<br>Buegee Team.</p>
                    </div>
                </div>
            </body>
            </html>";
    }
}

