using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Utils.Attributes;

public class ApiRoute : RouteAttribute
{
    public ApiRoute([StringSyntax("Route")] string template = "") : base($"api/{template}") {}
}
