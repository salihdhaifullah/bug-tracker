using System.ComponentModel.DataAnnotations;

namespace Buegee.Utils.Attributes;

public class IdValidationAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        string? strValue = value as string;

        if (!string.IsNullOrEmpty(strValue))
        {
            return strValue.Length == 26;
        }

        return true;
    }
}
