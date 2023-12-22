using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.FirebaseService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments/{attachmentId}")]
[ApiController]
public class AttachmentController : ControllerBase
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

    [HttpDelete]
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

    [HttpPatch]
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
}
