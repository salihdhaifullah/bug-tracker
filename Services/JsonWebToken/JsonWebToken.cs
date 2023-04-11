using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace bug_tracker.Services.JsonWebToken
{
    public class JsonWebToken : IJsonWebToken
    {
        private readonly string SecretKey;

    private readonly IConfiguration _config;

        public JsonWebToken(IConfiguration config) {
            _config = config;
             SecretKey = _config.GetValue<string>("SecretKey");
        }

        public string GenerateJwtToken(int userId, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("id", userId.ToString()),
                    new Claim("role", role)
                }),
                Expires = DateTime.UtcNow.AddMonths(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public (int?, string?) VerifyJwtToken(string token)
        {
            if (token == null) return (null, null);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretKey);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                int userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);
                string role = jwtToken.Claims.First(x => x.Type == "role").Value;
                return (userId, role);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return (null, null);
            }
        }


    }
}
