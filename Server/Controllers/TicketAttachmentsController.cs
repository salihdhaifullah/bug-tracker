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
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments")]
[ApiController]
public class TicketAttachmentsController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;
    private readonly IFirebaseService _firebase;
    private readonly ILogger<TicketAttachmentsController> _logger;

    public TicketAttachmentsController(DataContext ctx, ILogger<TicketAttachmentsController> logger, IAuthService auth, IFirebaseService firebase)
    {
        _ctx = ctx;
        _logger = logger;
        _auth = auth;
        _firebase = firebase;
    }

    [HttpGet]
    public async Task<IActionResult> GetTicketAttachments([FromRoute] string ticketId)
    {
        try
        {
            var attachments = await _ctx.Attachments
                .Where(a => a.TicketId == ticketId)
                .Select(a => new {
                    id = a.Id,
                    title = a.Title,
                    url = a.Url,
                    createdAt = a.CreatedAt,
                })
                .ToListAsync();

            return HttpResult.Ok(body: attachments);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpPost, Authorized, BodyValidation]
    public async Task<IActionResult> UploadTicketAttachment([FromRoute] string ticketId, [FromBody] AttachmentDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            if (!await _ctx.Tickets.AnyAsync(t => t.Id == ticketId && t.Creator.UserId == userId)) {
                return HttpResult.BadRequest("can't add attachment to this ticket");
            }

            var fileUrl = await _firebase.Upload(Convert.FromBase64String(dto.Data), dto.ContentType);

            await _ctx.Attachments.AddAsync(new Attachment
            {
                Id = Ulid.NewUlid().ToString(),
                Title = dto.Title,
                Url = fileUrl,
                TicketId = ticketId
            });

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully added attachment");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }
}
