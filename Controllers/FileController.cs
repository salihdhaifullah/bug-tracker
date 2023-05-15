using Buegee.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Buegee.Utils.Attributes;
using Buegee.Utils.Extensions;

namespace Buegee.Controllers;

[ApiRoute("files")]
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
        var file = await _ctx.Files
                .Where(f => f.IsPrivate == false && f.Id == Id)
                .Select(f => new {
                    Data = f.Data,
                    ContentType = f.ContentType,
                })
                .FirstOrDefaultAsync();

        if (file is null) return NotFound();

        return File(file.Data, file.ContentType.GetStringValue() ?? "text/plain");
    }
}
