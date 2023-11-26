using Buegee.Data;
using Buegee.DTO;
using Buegee.Models;
using Buegee.Services.AuthService;
using Buegee.Services.FirebaseService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("attachment")]
[Consumes("application/json")]
public class AttachmentController : Controller
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly IFirebaseService _firebase;
    private readonly ILogger<AttachmentController> _logger;

    public AttachmentController(DataContext ctx, ILogger<AttachmentController> logger, IAuthService auth, IFirebaseService firebase)
    {
        _ctx = ctx;
        _logger = logger;
        _auth = auth;
        _firebase = firebase;
    }

    [HttpPost, Authorized, BodyValidation]
    public async Task<IActionResult> AddAttachment([FromBody] AttachmentDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var isUser = await _ctx.Users.AnyAsync(u => u.Id == userId);

            if (!isUser) return HttpResult.UnAuthorized();

            var fileUrl = await _firebase.Upload(Convert.FromBase64String(dto.Data), dto.ContentType);

            await _ctx.Attachments.AddAsync(new Attachment
            {
                Id = Ulid.NewUlid().ToString(),
                Title = dto.Title,
                CreatorId = userId,
                Url = fileUrl,
                TicketId = dto.TicketId
            });

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully add attachment");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("attachments/{ticketId}")]
    public async Task<IActionResult> Attachments([FromRoute] string ticketId, [FromQuery] int take = 10, [FromQuery] int page = 1, [FromQuery] string sort = "oldest")
    {
        try
        {

            _auth.TryGetId(Request, out string? userId);

            var query = _ctx.Attachments.Where(a => a.TicketId == ticketId);

            if (sort == "latest") query = query.OrderByDescending(a => a.CreatedAt);
            else query = query.OrderBy(a => a.CreatedAt);

            var attachments = await query.Select(a => new
            {
                creator = new
                {
                    name = $"{a.Creator.FirstName} {a.Creator.LastName}",
                    id = a.CreatorId
                },
                title = a.Title,
                url = a.Url,
                createdAt = a.CreatedAt,
            })
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

            return HttpResult.Ok(body: attachments);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("attachments-count/{ticketId}")]
    public async Task<IActionResult> AttachmentsCount([FromRoute] string ticketId)
    {
        try
        {
            _auth.TryGetId(Request, out string? userId);

            var count = await _ctx.Attachments.Where(a => a.TicketId == ticketId).CountAsync();

            return HttpResult.Ok(body: count);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

}
