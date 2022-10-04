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

        [HttpPost("Create"), Authorize(Roles = "Admin, ProjectManger")]
        public async Task<IActionResult> CreateProject(ProjectDto req)
        {
            var IsSameName = _context.Projects.Any(project => project.Name == req.Name);

            if (IsSameName)
            {
                var message = new { message = "Project Name Already Exist try another one" };
                return Ok(message);
            };

            Project ProjectData = new()
            {
                Name = req.Name,
                Title = req.Title,
                Description = req.Description,
                CreatedAt = DateTime.UtcNow,
            };
            var project = await _context.Projects.AddAsync(ProjectData);

            _context.SaveChanges();

            var res = new { message = "Project Created Successfully" };
            return Ok(res);
        }


        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetProject([FromRoute] int id)
        {
            var Projects = await _context.Projects.Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Description,
                    p.ClosedAt,
                    p.CreatedAt,
                    p.Id,
                    p.IsClosed,
                    p.Name,
                    p.Title
                }).FirstOrDefaultAsync();

            return Ok(Projects);
        }


        [HttpGet, Authorize]
        public IActionResult GetProjects()
        {
            var Projects = _context.Projects.Select(p => new
            {
                p.Name,
                p.Id,
                p.Title,
                p.IsClosed,
                p.CreatedAt,
                p.Description,
            }).ToList();
            return Ok(Projects);
        }

        [HttpPatch("{id}"), Authorize(Roles = "Admin, ProjectManger")]
        public IActionResult UpdateProject([FromRoute] int id, [FromBody] ProjectDto req)
        {
            var isFound = _context.Projects.Find(id);
            if (isFound == null) return NotFound("Project Not Found");
            isFound.Name = req.Name;
            isFound.Title = req.Title;
            isFound.Description = req.Description;
            isFound.UpdatedAt = DateTime.UtcNow;
            _context.SaveChanges();
            return Ok(isFound);
        }

        [HttpPut("{id}"), Authorize(Roles = "Admin, ProjectManger")]
        public async Task<IActionResult> CloseProject([FromRoute] int id)
        {
            var isFound = await _context.Projects.FindAsync(id);

            if (isFound == null) return NotFound("Project Not Found");

            isFound.ClosedAt = DateTime.UtcNow;
            isFound.IsClosed = true;
            await _context.SaveChangesAsync();

            var message = new { message = "Project Closed Successfully" };
            
            return Ok(message);
        }


        [HttpPut("open/{id}"), Authorize(Roles = "Admin, ProjectManger")]
        public async Task<IActionResult> OpenProject([FromRoute] int id)
        {
            var isFound = await _context.Projects.FindAsync(id);

            if (isFound == null) return NotFound("Project Not Found");

            isFound.ClosedAt = DateTime.UtcNow;
            isFound.IsClosed = false;
            await _context.SaveChangesAsync();

            var message = new { message = "Project Opened Successfully" };

            return Ok(message);
        }


    }
}
