using Buegee.Data;
using Buegee.Services.AuthService;
using Buegee.Utils;
using Buegee.Utils.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buegee.Controllers;

[ApiRoute("user")]
[Consumes("application/json")]
public class UserController : Controller {
    private readonly DataContext _ctx;
    private readonly IAuthService _auth;

    public UserController(DataContext ctx, IAuthService auth) {
        _auth = auth;
        _ctx = ctx;
    }
}
