using Microsoft.AspNetCore.Mvc;
using Buegee.Utils.Attributes;

namespace Buegee.Controllers;

[ApiRoute]
public class HomeController : Controller
{
    [HttpGet]
    public string Index()
    {
        return "<h1>Hello World</h1>";
    }
}

