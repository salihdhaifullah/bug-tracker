using Microsoft.AspNetCore.Mvc;
using server.Models.db;
using server.Models.api;
using server.Data;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly Context _context;
        private readonly IJsonWebToken _token;
        private readonly IPasswordServices _password;

        public OrganizationController(Context context, IJsonWebToken token, IPasswordServices password)
        {
            _context = context;
            _token = token;
            _password = password;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return Ok("Login");
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrganization(OrganizationReq req)
        {
            Organization OrganizationData = new()
            {
                Name = req.Name,
                Description = req.Description,
                AdmanId = req.AdmanId,
                Logo = req.Logo
            };
            var NewOrganization = await _context.Organizations.AddAsync(OrganizationData);
            _context.SaveChanges();
            return Ok(NewOrganization.Entity);
        }

        [HttpPatch("update")]
        public async Task<IActionResult> UpdateOrganization(OrganizationReq req)
        {
            var OrganizationData = await _context.Organizations.FindAsync(req.Id);
            if (OrganizationData == null) return NotFound();

            OrganizationData.Name = req.Name;
            OrganizationData.Description = req.Description;
            OrganizationData.Logo = req.Logo;
            _context.SaveChanges();
            return Ok(OrganizationData);
        }


        [HttpPost("assignee_employs")]
        public async Task<IActionResult> AssigneeEmploys(OrganizationReq req)
        {
            var OrganizationData = await _context.Organizations.FindAsync(req.Id);
            if (OrganizationData == null) return NotFound();
            if (req.Employs.Count > 100) return BadRequest("Max 10 employees per Request");
            for (int i = 0; i < req.Employs.Count; i++)
            {
                var EmployData = await _context.Users.FindAsync(req.Employs[i]);
                if (EmployData == null) return NotFound("user Not Found");
            }
            OrganizationData.Employs = req.Employs;
            _context.SaveChanges();
            return Ok(OrganizationData);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrganization([FromRoute] string id)
        {
            var OrganizationData = await _context.Organizations.FindAsync(id);
            if (OrganizationData == null) return NotFound();
            return Ok(OrganizationData);
        }
    }
}
