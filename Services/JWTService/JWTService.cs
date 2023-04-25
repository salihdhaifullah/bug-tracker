using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Buegee.Services.JWTService;

public enum VerifyJwtErrors { invalid_token, token_expired, invalid_signature }

public class Claim
{
    public string name { get; set; } = null!;
    public string value { get; set; } = null!;
}

public class JWTService : IJWTService
{

    private readonly string SecretKey;

    public JWTService(IConfiguration config)
    {
        var isFoundSecretKey = config.GetSection("JWT").GetValue<string>("SecretKey");
        if (String.IsNullOrEmpty(isFoundSecretKey)) throw new Exception("SecretKey Not Found");
        SecretKey = isFoundSecretKey;
    }

    public string GenerateJwt(long milleSecondes, List<Claim> claims)
    {
        var header = new { alg = "HS256", typ = "JWT" };
        var payload = new Dictionary<string, string>();

        foreach (var claim in claims)
        {
            payload[claim.name] = claim.value;
        }

        payload["exp"] = (DateTimeOffset.Now + TimeSpan.FromMilliseconds(milleSecondes)).ToUnixTimeSeconds().ToString();

        StringBuilder tokenSB = new StringBuilder();
        tokenSB.Append(base64urlEncode(JsonSerializer.Serialize(header)));
        tokenSB.Append('.');
        tokenSB.Append(base64urlEncode(JsonSerializer.Serialize(payload)));

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

    public (Dictionary<string, string>? payload, VerifyJwtErrors? error) VerifyJwt(string jwt)
    {
        try
        {
            var parts = jwt.Split('.');
            if (parts.Length != 3) return (null, VerifyJwtErrors.invalid_token);

            var header = JsonSerializer.Deserialize<Dictionary<string, string>>(base64urlDecode(parts[0]));
            var payload = JsonSerializer.Deserialize<Dictionary<string, string>>(base64urlDecode(parts[1]));
            var signature = parts[2];

            if (header?["alg"]?.ToString() != "HS256" || header?["typ"]?.ToString() != "JWT") return (null, VerifyJwtErrors.invalid_token);

            if (payload?["exp"] is not null && long.Parse(payload["exp"]) < DateTimeOffset.Now.ToUnixTimeSeconds())
            {
                return (null, VerifyJwtErrors.token_expired);
            }

            var expectedSignature = Convert.ToBase64String(new HMACSHA256(Encoding.UTF8.GetBytes(SecretKey)).ComputeHash(Encoding.UTF8.GetBytes(parts[0] + "." + parts[1])));

            if (signature != expectedSignature)
            {
                return (null, VerifyJwtErrors.invalid_signature);
            }

            return (payload, null);
        }
        catch (Exception)
        {
            return (null, VerifyJwtErrors.invalid_token);
        }
    }

    private static string base64urlEncode(string str)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
    }

    private static string base64urlDecode(string b64)
    {
        return Encoding.UTF8.GetString(Convert.FromBase64String(b64));
    }

}
