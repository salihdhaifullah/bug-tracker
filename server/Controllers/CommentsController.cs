using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using server.Services.JsonWebToken;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly Context _context;
        private readonly IJsonWebToken _token;

        public CommentsController(Context context, IJsonWebToken token)
        {
            _context = context;
            _token = token;
        }

        [HttpPost("{ticketId}"), Authorize]
        public async Task<IActionResult> CreateComment([FromBody] CommentDto req, [FromRoute] int ticketId)
        {

            string? header = Request.Headers.Authorization;

            string[] token = header.Split(' ');

            var UserId = _token.VerifyToken(token[1]);

            if (UserId == null) return Unauthorized();

            if (req.Content == null) return BadRequest();

            if (req.Content.Length > 500) return BadRequest("max Length 500 characters");

            var isTicketExist = await _context.Tickets.AnyAsync(t => t.Id == ticketId);

            if (!isTicketExist) return NotFound();
            var comment = new Comment
            {
                Content = req.Content,
                UserId = (int)UserId,
                TicketId = ticketId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpGet("{ticketId}"), Authorize]
        public async Task<IActionResult> GetComments([FromRoute] int ticketId)
        {
            var comments = await _context.Comments.Where(c => c.TicketId == ticketId).ToListAsync();
            return Ok(comments);
        }


        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateComment([FromRoute] int id, [FromBody] CommentDto req)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(comment => comment.Id == id);

            if (comment == null) return NotFound();

            string? header = Request.Headers.Authorization;

            string[] token = header.Split(' ');

            var UserId = _token.VerifyToken(token[1]);

            if (UserId == null) return Unauthorized();

            if (comment.UserId != (int)UserId) return Unauthorized();

            comment.Content = req.Content;

            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpDelete("{Id}"), Authorize]
        public async Task<IActionResult> DeleteComment([FromRoute] int Id)
        {
            string? header = Request.Headers.Authorization;

            string[] token = header.Split(' ');

            var UserId = _token.VerifyToken(token[1]);

            if (UserId == null) return Unauthorized();

            var comment = await _context.Comments.FirstOrDefaultAsync(comment => comment.Id == Id);

            if (comment == null) return NotFound();

            if (comment.UserId != (int)UserId) return Unauthorized();

            _context.Comments.Remove(comment);

            await _context.SaveChangesAsync();

            return Ok("Deleted");
        }
    }
}