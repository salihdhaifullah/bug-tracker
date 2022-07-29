using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;

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
        [HttpPost("Create")]
        public async Task<IActionResult> CreateProject(ProjectReq req)
        {
            Project ProjectData = new()
            {
                MangerId = req.MangerId,
                Name = req.Name,
                Title = req.Title,
                Description = req.Description,
                CreatedAt = DateTime.UtcNow,
                DevelopersId = req.DevelopersIds
            };
            var NewProject = await _context.Projects.AddAsync(ProjectData);
            _context.SaveChanges();
            return Ok(NewProject.Entity);
        }

        [HttpPatch("Update")]
        public async Task<IActionResult> UpdateProject(ProjectReq req)
        {
            var ProjectData = await _context.Projects.FindAsync(req.Id);
            if (ProjectData == null) return NotFound();

            ProjectData.Name = req.Name;
            ProjectData.Title = req.Title;
            ProjectData.Description = req.Description;
            ProjectData.UpdatedAt = DateTime.UtcNow;
            _context.SaveChanges();
            return Ok(ProjectData);
        }

        [HttpPatch("AddDeveloper/{projectId}")]
        public async Task<IActionResult> AssignProject([FromRoute] string projectId, [FromBody] string[] DevelopersIds)
        {
            var ProjectData = await _context.Projects.FindAsync(Convert.ToInt32(projectId));
            if (ProjectData == null) return NotFound("Project Not Found");
            if (DevelopersIds == null) return BadRequest("User Not Found");
            if (ProjectData.DevelopersId?.Count >= 1) return BadRequest("Invalid Request");

            for (int i = 0; i < DevelopersIds.Length; i++)
            {
                var DeveloperData = await _context.Users.FindAsync(Convert.ToInt32(DevelopersIds[i]));
                if (DeveloperData == null) return BadRequest("User Not Found");
                ProjectData.DevelopersId.Add(Convert.ToInt32(DevelopersIds[i]));
            }
            await _context.SaveChangesAsync();

            return Ok(ProjectData);
        }

        [HttpGet]
        public IActionResult GetProjects()
        {
            var Projects = _context.Projects.ToList();
            return Ok(Projects);
        }

    }
}
