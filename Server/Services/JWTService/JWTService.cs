using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Buegee.Utils;

namespace Buegee.Services.JWTService;

public class JWTService : IJWTService
{

    private readonly string _secretKey;

    public JWTService(IConfiguration config)
    {
        var isFoundSecretKey = config.GetSection("JWT").GetValue<string>("SecretKey");

        if (string.IsNullOrEmpty(isFoundSecretKey)) throw new Exception("Secret Key Not Configured");

        _secretKey = isFoundSecretKey;
    }

    public string GenerateJwt(TimeSpan age, Dictionary<string, string> claims)
    {
        var header = new { alg = "HS256", typ = "JWT" };

        claims["exp"] = (DateTimeOffset.Now + age).ToUnixTimeSeconds().ToString();

        var tokenStringBuilder = new StringBuilder();

        tokenStringBuilder.Append(Helper.UrlEncode(JsonSerializer.Serialize(header)));
        tokenStringBuilder.Append('.');
        tokenStringBuilder.Append(Helper.UrlEncode(JsonSerializer.Serialize(claims)));

        var token = tokenStringBuilder.ToString();
        var signature = Convert.ToBase64String(
            new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey))
                .ComputeHash(Encoding.UTF8.GetBytes(token))
        );

        StringBuilder jwtStringBuilder = new StringBuilder();

        jwtStringBuilder.Append(token);
        jwtStringBuilder.Append('.');
        jwtStringBuilder.Append(signature);

        return jwtStringBuilder.ToString();
    }

    public Dictionary<string, string> VerifyJwt(string jwt)
    {
        var parts = jwt.Split('.');
        if (parts.Length != 3) throw new Exception("Invalid JWT");

        var header = JsonSerializer.Deserialize<Dictionary<string, string>>(Helper.UrlDecode(parts[0]));
        var payload = JsonSerializer.Deserialize<Dictionary<string, string>>(Helper.UrlDecode(parts[1]));
        var signature = parts[2];

        if (header?["alg"]?.ToString() != "HS256"
            || header?["typ"]?.ToString() != "JWT"
            || payload?["exp"] is null
            || long.Parse(payload["exp"]) < DateTimeOffset.Now.ToUnixTimeSeconds())
            throw new Exception("Invalid JWT");

        var expectedSignature = Convert.ToBase64String(
            new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey))
            .ComputeHash(Encoding.UTF8.GetBytes(parts[0] + "." + parts[1]))
            );

        if (signature != expectedSignature) throw new Exception("Invalid JWT");

        return payload;
    }
}
