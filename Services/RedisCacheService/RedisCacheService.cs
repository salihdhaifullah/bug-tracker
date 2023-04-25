using StackExchange.Redis;

namespace Buegee.Services.RedisCacheService;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDatabase Redis;
    private readonly string? ConnectionString;

    public RedisCacheService(IConfiguration config)
    {
        ConnectionString = config.GetSection("Rides").GetValue<string>("ConnectionString");
        if (String.IsNullOrEmpty(ConnectionString)) throw new Exception("Rides Connection String Are Not Configured");
        Redis = ConnectionMultiplexer.Connect(ConnectionString).GetDatabase();
    }

    IDatabase IRedisCacheService.Redis => Redis;
}
