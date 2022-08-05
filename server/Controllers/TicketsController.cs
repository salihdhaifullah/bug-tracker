﻿using Microsoft.AspNetCore.Authorization;
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
                p.IsCompleted
            }).ToList();

            return Ok(Tickets);
        }

        [HttpPost("Create"), Authorize(Roles = "Admin, Submitter, ProjectManger")]
        public async Task<IActionResult> CreateTicket(TicketReq req)
        {
            // Priority => Low, Medium, High
            // Status => New, In Progress, Resolved, Closed
            // Type => Feature, Bug

            if (req.Type != Types.Feature && req.Type != Types.Bug) return BadRequest();
            if (req.Priority != Priorates.Low && req.Priority != Priorates.Medium && req.Priority != Priorates.High) return BadRequest();
            if (req.Status != Statuses.New && req.Status != Statuses.Closed && req.Status != Statuses.InProgress) return BadRequest();
            string? header = Request.Headers.Authorization;

            if (header != null)
            {
                string[] token = header.Split(' ');

                Console.WriteLine(token);
                
                int? id = _token.VerifyToken(token[1]);

                if (id != null) Console.WriteLine(id);
            }

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

        [HttpPut("Status/{id}"), Authorize(Roles = "Developer")]
        public IActionResult InProgress(TicketReq req)
        {
            var hello = Request.Headers.Authorization;

            var Ticket = _context.Tickets.FirstOrDefault(ticket => ticket.Id == 1);
            if (Ticket == null) return BadRequest("Ticket Not Found");
            // Ticket.Status = Statuses.InProgress;
            // _context.SaveChanges();
            return Ok(hello);
        }
    }
}
