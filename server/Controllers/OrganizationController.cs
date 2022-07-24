using Microsoft.AspNetCore.Mvc;
using server.Models.db;
using server.Models.api;
using server.Data;
using server.Services.JsonWebToken;
using server.Services.PasswordServices;
using server.Services.EmailServices;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly Context _context;
        private readonly IEmailServices _email;
        private readonly IJsonWebToken _token;
        private readonly IPasswordServices _password;

        public OrganizationController(Context context, IEmailServices email, IJsonWebToken token, IPasswordServices password)
        {
            _context = context;
            _email = email;
            _token = token;
            _password = password;
        }
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

        public async Task<IActionResult> GetOrganization(OrganizationReq req)
        {
            var OrganizationData = await _context.Organizations.FindAsync(req.Id);
            if (OrganizationData == null) return NotFound();
            return Ok(OrganizationData);
        }

        
    }
}
