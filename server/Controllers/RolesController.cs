using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models.api;
using server.Models.db;
using Microsoft.AspNetCore.Authorization;


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

        [HttpGet, Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                
                var users = await _context.Users.Select(u => new
                {
                    u.FirstName,
                    u.LastName,
                    u.Role,
                    u.Email,
                    u.CreateAt,
                    u.Id,
                    
                }).ToListAsync();

                return Ok(users);
            }
            catch (Exception err)
            {
                throw err;
            }
        }


        [HttpPatch, Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUserRole([FromBody] RoleReq value)
        {
            
            for (int i = 0; i < value.UsersId.Count; i++)
            {
                if (value.Role == "Admin") return BadRequest("can not change Admin Role");
                if (value.Role != Roles.Developer && value.Role != Roles.Submitter && value.Role != Roles.ProjectManger) return BadRequest("Role not found");
                var user = await _context.Users.FindAsync(value.UsersId[i]);
                if (user == null) return BadRequest();
                if (user.Role == Roles.Admin) return BadRequest("can not change Admin Role");
                user.Role = value.Role;
            }

            await _context.SaveChangesAsync();

            return Ok();

        }
    }
}
