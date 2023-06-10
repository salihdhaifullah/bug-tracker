using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;

namespace Buegee.Utils.Attributes;

public class ApiRouteAttribute : RouteAttribute
{
    public ApiRouteAttribute([StringSyntax("Route")] string template = "") : base($"api/{template}") {}
}
