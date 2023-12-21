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

            if (!await _ctx.Tickets.AnyAsync(t => t.Creator.UserId == userId)) {
                return HttpResult.BadRequest("can't add attachment to this ticket");
            }

            var fileUrl = await _firebase.Upload(Convert.FromBase64String(dto.Data), dto.ContentType);

            await _ctx.Attachments.AddAsync(new Attachment
            {
                Id = Ulid.NewUlid().ToString(),
                Title = dto.Title,
                Url = fileUrl,
                TicketId = dto.TicketId
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

    [HttpPatch("{attachmentId}"), Authorized, BodyValidation]
    public async Task<IActionResult> UpdateAttachment([FromRoute] string attachmentId, [FromBody] UpdateAttachmentDTO dto)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var attachment = await _ctx.Attachments
                    .Where(a => a.Id == attachmentId && a.Ticket.Creator.UserId == userId)
                    .FirstOrDefaultAsync();

            if (attachment == null) return HttpResult.BadRequest("attachment not found");

            if (dto.Title != null) attachment.Title = dto.Title;
            if (dto.ContentType != null && dto.Data != null)
            {
                var newFileUrl = await _firebase.Update(attachment.Url, dto.ContentType, Convert.FromBase64String(dto.Data));
                attachment.Url = newFileUrl;
            }

            await _ctx.SaveChangesAsync();

            if (dto.Title != null || (dto.ContentType != null && dto.Data != null))
            {
                return HttpResult.Ok("successfully updated attachment");
            }

            return HttpResult.Ok();
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }


    [HttpDelete("{attachmentId}"), Authorized]
    public async Task<IActionResult> DeleteAttachment([FromRoute] string attachmentId)
    {
        try
        {
            var userId = _auth.GetId(Request);

            var attachment = await _ctx.Attachments
                    .Where(a => a.Id == attachmentId && a.Ticket.Creator.UserId == userId)
                    .FirstOrDefaultAsync();

            if (attachment == null) return HttpResult.NotFound("attachment not found");

            await _firebase.Delete(attachment.Url);

            _ctx.Remove(attachment);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted attachment");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return HttpResult.InternalServerError();
        }
    }

    [HttpGet("attachments/{ticketId}")]
    public async Task<IActionResult> Attachments([FromRoute] string ticketId)
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

}
