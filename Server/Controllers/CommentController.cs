using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Services.DataService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("users/{userId}/projects/{projectId}/tickets/{ticketId}/comments")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly IDataService _data;
    private readonly ILogger<CommentController> _logger;

    public CommentController(DataContext ctx, IAuthService auth, IDataService data, ILogger<CommentController> logger)
    {
        _ctx = ctx;
        _auth = auth;
        _data = data;
        _logger = logger;
    }

    [HttpPost, BodyValidation, Authorized]
    public async Task<IActionResult> CreateComment([FromBody] ContentDTO dto, [FromRoute] string ticketId)
    {
        try
        {
            var content = await _data.CreateContent(dto, _ctx);

            await _ctx.Comments.AddAsync(new Comment()
            {
                CommenterId = _auth.GetId(Request),
                Id = Ulid.NewUlid().ToString(),
                ContentId = content.Entity.Id,
                TicketId = ticketId,
            });

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("Successfully commented");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpDelete("{commentId}"), Authorized]
    public async Task<IActionResult> DeleteComment([FromRoute] string commentId)
    {
        try
        {
            var comment = await _ctx.Comments
            .Where(c => c.Id == commentId && c.CommenterId == _auth.GetId(Request))
            .FirstOrDefaultAsync();

            if (comment is null) return HttpResult.NotFound("comment not found");

            _ctx.Remove(comment);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted comment");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetComments([FromRoute] string ticketId, [FromQuery] int take = 10, [FromQuery] int page = 1)
    {
        try
        {
            var comments = await _ctx.Comments
            .Where(c => c.TicketId == ticketId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new
            {
                commenter = new
                {
                    name = $"{c.Commenter.FirstName} {c.Commenter.LastName}",
                    avatarUrl = c.Commenter.AvatarUrl,
                    id = c.Commenter.Id
                },
                contentId = c.ContentId,
                createdAt = c.CreatedAt,
                id = c.Id
            })
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

            return HttpResult.Ok(body: comments);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetCommentsCount([FromRoute] string ticketId)
    {
        try
        {
            var count = await _ctx.Comments.Where(c => c.TicketId == ticketId).CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
