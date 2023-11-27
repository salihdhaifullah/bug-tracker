using StackExchange.Redis;

namespace Buegee.Services.RedisCacheService;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDatabase _redis;
    private readonly string? _connectionString;

    public RedisCacheService(IConfiguration config)
    {
        _connectionString = config.GetSection("Rides").GetValue<string>("ConnectionString");

        if (String.IsNullOrEmpty(_connectionString)) throw new Exception("Rides Connection String Are Not Configured");

        _redis = ConnectionMultiplexer.Connect(_connectionString).GetDatabase();
    }

    IDatabase IRedisCacheService.Redis => _redis;
}
