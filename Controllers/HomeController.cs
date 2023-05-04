using System.Text;
using Buegee.Services;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Controllers;

public class HomeController : Controller
{
    private readonly DataContext _ctx;
    public HomeController(DataContext ctx) {
        _ctx = ctx;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

[HttpGet("test")]
public async Task<IActionResult> Test()
{
    var client = new HttpClient();
    var Image = await client.GetByteArrayAsync("https://api.dicebear.com/6.x/identicon/svg?seed=ewg");
    return File(Image, "image/svg+xml");
}
}
