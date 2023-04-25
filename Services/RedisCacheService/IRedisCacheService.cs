using StackExchange.Redis;

namespace Buegee.Services.RedisCacheService;

public interface IRedisCacheService
{
    IDatabase Redis { get; }
}
