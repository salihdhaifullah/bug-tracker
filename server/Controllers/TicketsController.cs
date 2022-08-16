using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;
using System.Collections;
using System.Linq;

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
        public IActionResult GetTickets([FromQuery] int ProjectId)
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
                p.IsCompleted,
                p.Id
            }).ToList();

            return Ok(Tickets);
        }

        [HttpGet("ticket/{id}"), Authorize]
        public async Task<IActionResult> GetTicketById([FromRoute] int id)
        {
            var ticket = await _context.Tickets.Where(t => t.Id == id).Select(p => new
            {
                devoloper = p.AssigneeTo.FirstName + " " + p.AssigneeTo.LastName,
                Submitter = p.Submitter.FirstName + " " + p.Submitter.LastName,
                p.Name,
                p.Priority,
                p.Status,
                p.CreatedAt,
                p.Type,
                p.UpdatedAt,
                p.IsCompleted,
                p.Description,
                p.Id

            }).FirstOrDefaultAsync();



            return Ok(ticket);
        }


        [HttpPost("Create"), Authorize(Roles = "Admin, Submitter, ProjectManger")]
        public async Task<IActionResult> CreateTicket(TicketDto req)
        {
            // Priority => Low, Medium, High
            // Status => New, In Progress, Resolved, Closed
            // Type => Feature, Bug

            if (req.Type != Types.Feature && req.Type != Types.Bug) return BadRequest("Type must be Feature or Bug");
            if (req.Priority != Priorates.Low && req.Priority != Priorates.Medium && req.Priority != Priorates.High) return BadRequest("Priority must be Low, Medium, High");

            string? header = Request.Headers.Authorization;

            if (header != null)
            {
                string[] token = header.Split(' ');

                Console.WriteLine(token);

                var id = _token.VerifyToken(token[1]);

                if (id != null)
                {
                    int id1 = id.Value;

                    var IsAssigneeToFound = _context.Users.Any(u => u.Id == req.AssigneeToId);
                    var project = await _context.Projects.FindAsync(req.ProjectId);


                    if (IsAssigneeToFound && project != null)
                    {
                        if (project.IsClosed) return BadRequest("Can Not Create Ticket in Closed Project");

                        Ticket TicketData = new()
                        {
                            Name = req.Name,
                            Description = req.Description,
                            CreatedAt = DateTime.UtcNow,
                            ProjectId = req.ProjectId,
                            Type = req.Type,
                            Status = Statuses.New,
                            Priority = req.Priority,
                            AssigneeToId = req.AssigneeToId,
                            SubmitterId = id1,
                        };

                        var NewTicket = await _context.Tickets.AddAsync(TicketData);
                        _context.SaveChanges();
                        return Ok(NewTicket.Entity);

                    } else return NotFound();
                }

                else return Unauthorized();
            }
            else return Unauthorized();

        }

        [HttpPut("Status/{id}"), Authorize(Roles = "Developer")]
        public IActionResult InProgress(TicketDto req)
        {
            var hello = Request.Headers.Authorization;

            var Ticket = _context.Tickets.FirstOrDefault(ticket => ticket.Id == 1);
            if (Ticket == null) return BadRequest("Ticket Not Found");
            // Ticket.Status = Statuses.InProgress;
            // _context.SaveChanges();
            return Ok(hello);
        }


        [HttpPatch("{id}"), Authorize(Roles = "Admin, Submitter, ProjectManger")]
        public async Task<IActionResult> UpdateTicket([FromRoute] int id, [FromBody] TicketDto req)
        {
            var Ticket = await _context.Tickets.FindAsync(id);
            if (Ticket == null) return NotFound();
            string? header = Request.Headers.Authorization;
            if (header != null)
            {
                string[] token = header.Split(' ');
                var id1 = _token.VerifyToken(token[1]);
                if (id1 != null)
                {
                    var user = await _context.Users.FindAsync(id1);
                    if (user == null) return Unauthorized();
                        

                    
                        Ticket.AssigneeToId = req.AssigneeToId;
                        Ticket.Description = req.Description;
                        Ticket.Name = req.Name;
                        Ticket.UpdatedAt = DateTime.UtcNow;
                        Ticket.Type = req.Type;
                        Ticket.Priority = req.Priority;
                        Ticket.SubmitterId = (int)id1;


                    
                    _context.SaveChanges();
                        return Ok(Ticket);
                    
                }
                else return Unauthorized();
            }
            else return Unauthorized();
        }

    }
}
