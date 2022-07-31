using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;
using System.Collections;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly Context _context;
        private readonly IJsonWebToken _token;
        private readonly IPasswordServices _password;

        public TicketsController(Context context, IJsonWebToken token, IPasswordServices password)
        {
            _context = context;
            _token = token;
            _password = password;
        }
        
        [HttpGet]
        public IActionResult GetTickets([FromQuery]int ProjectId)
        {
            var Tickets = _context.Tickets.Where(ticket => ticket.ProjectId == ProjectId).ToList();
            return Ok(Tickets);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateTicket(TicketReq req)
        {

            
            Ticket TicketData = new()
            {
                Name = req.Name,
                Description = req.Description,
                CreatedAt = DateTime.UtcNow,
                ProjectId = req.ProjectId,
                IsBug = req.IsBug, 
                IsFeature = req.IsFeature,
                AssigneeToId = req.AssigneeToId,
                SubmitterId = req.SubmitterId,

            };
            var NewTicket = await _context.Tickets.AddAsync(TicketData);
            _context.SaveChanges();
            return Ok(NewTicket.Entity);

        }  
    }
}
