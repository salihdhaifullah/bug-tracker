using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Buegee.Extensions.Classes;
using Buegee.Extensions.Utils;

namespace Buegee.Services.JWTService;

public class JWTService : IJWTService
{

    private readonly string SecretKey;

    public JWTService(IConfiguration config)
    {
        var isFoundSecretKey = config.GetSection("JWT").GetValue<string>("SecretKey");

        if (String.IsNullOrEmpty(isFoundSecretKey)) throw new Exception("Secret Key Not Configured");

        SecretKey = isFoundSecretKey;
    }

    public string GenerateJwt(TimeSpan Age, List<Claim> claims)
    {
        var header = new { alg = "HS256", typ = "JWT" };
        var payload = new Dictionary<string, string>();

        foreach (var claim in claims)
        {
            payload[claim.Name] = claim.Value;
        }

        payload["exp"] = (DateTimeOffset.Now + Age).ToUnixTimeSeconds().ToString();

        var tokenSB = new StringBuilder();

        tokenSB.Append(Base64.UrlEncode(JsonSerializer.Serialize(header)));
        tokenSB.Append('.');
        tokenSB.Append(Base64.UrlEncode(JsonSerializer.Serialize(payload)));

        var token = tokenSB.ToString();

        var signature = Convert.ToBase64String(
            new HMACSHA256(Encoding.UTF8.GetBytes(SecretKey))
                .ComputeHash(Encoding.UTF8.GetBytes(token))
        );

        StringBuilder jwtSB = new StringBuilder();

        jwtSB.Append(token);
        jwtSB.Append('.');
        jwtSB.Append(signature);

        return jwtSB.ToString();
    }

    public Dictionary<string, string> VerifyJwt(string jwt)
    {
        var parts = jwt.Split('.');
        if (parts.Length != 3) throw new Exception("Invalid JWT");

        var header = JsonSerializer.Deserialize<Dictionary<string, string>>(Base64.UrlDecode(parts[0]));
        var payload = JsonSerializer.Deserialize<Dictionary<string, string>>(Base64.UrlDecode(parts[1]));
        var signature = parts[2];

        if (
            header?["alg"]?.ToString() != "HS256"
            || header?["typ"]?.ToString() != "JWT"
            || payload?["exp"] is null
            || long.Parse(payload["exp"]) < DateTimeOffset.Now.ToUnixTimeSeconds()
            ) throw new Exception("Invalid JWT");

        var expectedSignature = Convert.ToBase64String(
            new HMACSHA256(Encoding.UTF8.GetBytes(SecretKey))
            .ComputeHash(Encoding.UTF8.GetBytes(parts[0] + "." + parts[1]))
            );

        if (signature != expectedSignature) throw new Exception("Invalid JWT");

        return payload;
    }

}
