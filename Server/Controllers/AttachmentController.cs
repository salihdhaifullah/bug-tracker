using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.AuthService;
using Buegee.Services.FirebaseService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Buegee.Utils.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;
[Consumes("application/json")]
[ApiRoute("users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments/{attachmentId}")]
[ApiController]
public class AttachmentController : ControllerBase
{
    private readonly DataContext _ctx;
    private readonly IFirebaseService _firebase;
    private readonly ILogger<AttachmentController> _logger;

    public AttachmentController(DataContext ctx, ILogger<AttachmentController> logger, IAuthService auth, IFirebaseService firebase)
    {
        _ctx = ctx;
        _logger = logger;
        _firebase = firebase;
    }

    [HttpDelete, Authorized, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> DeleteAttachment([FromRoute] string attachmentId)
    {
        try
        {
            var attachment = await _ctx.Attachments
                .Where(a => a.Id == attachmentId)
                .FirstOrDefaultAsync();

            if (attachment == null) return HttpResult.NotFound("attachment not found");

            await _firebase.Delete(attachment.Url);

            _ctx.Remove(attachment);

            await _ctx.SaveChangesAsync();

            return HttpResult.Ok("successfully deleted attachment");
        }
        catch (Exception e)
        {
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }

    [HttpPatch, Authorized, ProjectArchive, ProjectRole(Role.owner, Role.project_manger)]
    public async Task<IActionResult> UpdateAttachment([FromRoute] string attachmentId, [FromBody] UpdateAttachmentDTO dto)
    {
        try
        {
            var attachment = await _ctx.Attachments
                    .Where(a => a.Id == attachmentId)
                    .FirstOrDefaultAsync();

            if (attachment == null) return HttpResult.NotFound("attachment not found");

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
            _logger.LogError(e,"");
            return HttpResult.InternalServerError();
        }
    }
}
