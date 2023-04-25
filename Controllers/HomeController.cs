using Microsoft.AspNetCore.Mvc;

namespace Buegee.Controllers;

public class HomeController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}
