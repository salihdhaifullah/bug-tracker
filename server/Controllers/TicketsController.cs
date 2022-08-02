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
            var Tickets = _context.Tickets.Where(ticket => ticket.ProjectId == ProjectId).Select(p => new
            {
                devoloper = p.AssigneeTo.FirstName + " " + p.AssigneeTo.LastName,
                Submitter = p.Submitter.FirstName + " " + p.Submitter.LastName,
                p.Name,
                p.Priority,
                p.Status,
                p.CreatedAt,
                p.Type,
                p.UpdatedAt,
                p.IsCompleted
            }).ToList();
            
            return Ok(Tickets);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateTicket(TicketReq req)
        {
                    // Priority => Low, Medium, High
                    // Status => New, In Progress, Resolved, Closed
                    // Type => Feature, Bug

                    if (req.Type != "Feature" && req.Type !=  "Bug") return BadRequest();
                    if (req.Priority != "Low" && req.Priority != "Medium" && req.Priority != "High") return BadRequest();
                    if (req.Status != "New" && req.Status != "Closed" && req.Status != "In Progress" && req.Status != "Resolved") return BadRequest();

            Ticket TicketData = new()
            {
                Name = req.Name,
                Description = req.Description,
                CreatedAt = DateTime.UtcNow,
                ProjectId = req.ProjectId,
                Type = req.Type,
                Status = req.Status,
                Priority = req.Priority,
                AssigneeToId = req.AssigneeToId,
                SubmitterId = req.SubmitterId,
            };
            
            var NewTicket = await _context.Tickets.AddAsync(TicketData);
            _context.SaveChanges();
            return Ok(NewTicket.Entity);
        }  

        [HttpPut("Status/{id}")]
        public IActionResult InProgress(TicketReq req)
        {
            var Ticket = _context.Tickets.FirstOrDefault(ticket => ticket.Id == 1);
            if (Ticket == null) return BadRequest("Ticket Not Found");
            Ticket.Status = "In Progress";
            _context.SaveChanges();
            return Ok(Ticket);
        }
    }
}
