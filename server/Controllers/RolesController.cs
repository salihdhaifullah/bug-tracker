using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {

        private readonly Context _context;


        public RolesController(Context context)
        {
            _context = context;

        }

        [HttpGet]
        public IActionResult GetAllUsersRoles()
        {
            var roles = _context.UserRoles.ToList();
            return Ok(roles);
        }


        [HttpPost]
        public async Task<IActionResult> CreateUserRole([FromBody] RoleReq value)
        {
            var user = await _context.Users.FindAsync(value.UserId);
            if (user == null) return BadRequest();

            UserRole userRole = new UserRole 
            {
                UserId = value.UserId,
                Role = value.Role,
                ProjectId = value.ProjectId
            };

            var IsFound = _context.Projects.Find(value.ProjectId);
            if (IsFound == null) return NotFound();
            var NewRole = _context.UserRoles.Add(userRole);
            IsFound.usersRolesId.Add(NewRole.Entity.Id);
            await _context.SaveChangesAsync();

            return Ok(IsFound);
        }


    }
}
