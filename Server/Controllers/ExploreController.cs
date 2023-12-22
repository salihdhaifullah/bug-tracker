using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("explore")]
[ApiController]
public class ExploreController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly ILogger<ExploreController> _logger;

    public ExploreController(DataContext ctx, ILogger<ExploreController> logger, IAuthService auth)
    {
        _ctx = ctx;
        _logger = logger;
        _auth = auth;
    }

    [HttpGet("{page}")]
    public async Task<IActionResult> ExplorePage([FromQuery] string? search, [FromRoute] int page = 1, [FromQuery] int take = 10)
    {
        try
        {
            _auth.TryGetId(Request, out string? currentUserId);

            var projects = await _ctx.Projects
                            .Where((p) => p.Members.Any(m => m.UserId != currentUserId)
                            && !p.IsPrivate
                            && (EF.Functions.ILike(p.Name, $"%{search}%")
                            || (search != null
                            && search.Length >= 3
                            && EF.Functions.ILike(p.Content.Markdown, $"%{search}%")))
                            ).OrderByDescending((p) => p.Activities.Max(a => a.CreatedAt))
                            .Select((p) => new
                            {
                                createdAt = p.CreatedAt,
                                id = p.Id,
                                isReadOnly = p.IsReadOnly,
                                name = p.Name,
                                members = p.Members.Count,
                                tickets = p.Tickets.Count,
                                content = p.Content.Markdown,
                                owner = p.Members.Where(m => m.Role == Role.owner).Select(m => new
                                {
                                    id = m.UserId,
                                    avatarUrl = m.User.AvatarUrl,
                                    name = $"{m.User.FirstName} {m.User.LastName}"
                                }).FirstOrDefault()
                            })
                            .Skip((page - 1) * take)
                            .Take(take)
                            .ToListAsync();

            return HttpResult.Ok(body: projects);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> ExploreCount([FromQuery] string? search, [FromQuery] int take = 10)
    {
        try
        {
            _auth.TryGetId(Request, out string? currentUserId);

            var count = await _ctx.Projects.Where((p) =>
                            p.Members.Any(m => m.UserId != currentUserId)
                            && !p.IsPrivate
                            && EF.Functions.ILike(p.Name, $"%{search}%")
                            ).CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
