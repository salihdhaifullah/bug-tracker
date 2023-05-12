using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Extensions.Attributes;

public class ApiRoute : RouteAttribute
{
    public ApiRoute([StringSyntax("Route")] string template = "") : base($"api/{template}") {}
}
