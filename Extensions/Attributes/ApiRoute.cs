using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;

public class ApiRoute : RouteAttribute
{
    public ApiRoute([StringSyntax("Route")] string template = "") : base($"api/{template}")
    {
    }
}
