using Microsoft.AspNetCore.Mvc;

namespace Buegee.Controllers;

public class ErrorsController : Controller {

    [HttpGet("/not-found")]
    public IActionResult NotFoundPage() {
        return View("NotFound");
    }

    [HttpGet("/forbidden")]
    public IActionResult ForbiddenPage() {
        return View("Forbidden");
    }

    [HttpGet("/unauthorized")]
    public IActionResult UnauthorizedPage() {
        return View("Unauthorized");
    }

    [HttpGet("/error")]
    public IActionResult ErrorPage() {
        return View("Error");
    }
}
