using Buegee.Models.DB;
using Buegee.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[Route("files")]
public class FileController : Controller
{
    private readonly DataContext _ctx;

    public FileController(DataContext ctx)
    {
        _ctx = ctx;
    }

    [HttpGet("public/{Id}")]
    public async Task<IActionResult> Public([FromRoute] int Id)
    {
        var Image = await _ctx.Files
                .Where(f => f.IsPrivate == false && f.Id == Id)
                .Select(f => new {
                    Data = f.Data,
                    ContentType = f.ContentType,
                })
                .FirstOrDefaultAsync();

        if (Image is null) return NotFound();

        return File(Image.Data, Image.ContentType.GetStringValue());
    }
}
