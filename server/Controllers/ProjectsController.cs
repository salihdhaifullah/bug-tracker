using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly Context _context;
        private readonly IJsonWebToken _token;
        private readonly IPasswordServices _password;

        public ProjectsController(Context context, IJsonWebToken token, IPasswordServices password)
        {
            _context = context;
            _token = token;
            _password = password;
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
                ProjectMangerId = req.ProjectMangerId,
                CreatedAt = DateTime.UtcNow,
            };
            var NewProject = await _context.Projects.AddAsync(ProjectData);
            _context.SaveChanges();
            return Ok(NewProject.Entity);
        }


        [HttpGet("{id}"), AllowAnonymous]
        public IActionResult GetProject([FromRoute] int id)
        {
            var Projects = _context.Projects.Where(p => p.Id == id)
            .Include(p => p.Tickets)
                .Select(p => new {
                    p.ProjectManger.LastName,
                    p.ProjectManger.Email,
                    p.ProjectManger.Id,
                    p.ProjectManger.CreateAt
                    });
            
            return Ok(Projects);
        }


        [HttpGet, AllowAnonymous]
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
            ProjectData.ProjectMangerId = req.ProjectMangerId;
            _context.SaveChanges();
            return Ok(ProjectData);
        }

    }
}
