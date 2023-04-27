
using Buegee.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Controllers;

[Controller]
[Route("admin")]
public class AdminController : Controller
{
    [HttpGet("create-project")]
    public IActionResult CreateProject() {

        ViewData["data"] = new string[] {"Hello", "Mom", "Cat", "Dog", "Monkey", "Banana"};

        return View();
    }

}
