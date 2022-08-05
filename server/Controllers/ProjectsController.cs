using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly Context _context;

        public ProjectsController(Context context)
        {
            _context = context;
        }

        [HttpPost("Create"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProject(ProjectReq req)
        {
            var IsSameName = _context.Projects.Any(project => project.Name == req.Name);

            if (IsSameName) return BadRequest("Project Name Already Exist try another one");
            Project ProjectData = new()
            {
                Name = req.Name,
                Title = req.Title,
                Description = req.Description,
                CreatedAt = DateTime.UtcNow,
            };
            await _context.Projects.AddAsync(ProjectData);
            
            _context.SaveChanges();
            
            return Ok("project create Success");
        }


        [HttpGet("{id}"), Authorize]
        public IActionResult GetProject([FromRoute] int id)
        {
            var Projects = _context.Projects.Where(p => p.Id == id)
                .Select(p => new {
                    p.Description,
                    p.ClosedAt,
                    p.CreatedAt,
                    p.Id,
                    p.IsClosed,
                    p.Name,
                    p.Title
                    });
            
            return Ok(Projects);
        }


        [HttpGet, Authorize]
        public IActionResult GetProjects()
        {
            var Projects = _context.Projects.Select(p => new {
                p.Name,
                p.Id,
                p.Title,
                p.IsClosed,
                p.CreatedAt,
                p.Description,
            }).ToList();
            return Ok(Projects);
        }


        [HttpPut("Update/{id}"), Authorize(Roles = "Admin")]
        public IActionResult UpdateProject([FromRoute] int id, [FromBody] ProjectReq req)
        {
            var ProjectData = _context.Projects.Find(id);
            if (ProjectData == null) return NotFound();
            ProjectData.Name = req.Name;
            ProjectData.Title = req.Title;
            ProjectData.Description = req.Description;
            ProjectData.UpdatedAt = DateTime.UtcNow;
            _context.SaveChanges();
            return Ok(ProjectData);
        }

    }
}
