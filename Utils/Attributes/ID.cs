using System;
using System.ComponentModel.DataAnnotations;

namespace Buegee.Utils.Attributes;

public class ID : ValidationAttribute
{
    // Constructor that accepts the minimum and maximum length as parameters.
    public ID(int length)
    {
        _length = length;
    }

     // TODO set the error massage

    // Override the IsValid method to perform the validation logic.
    public override bool IsValid(object value)
    {
        // Convert the value to a string
        string strValue = value as string;

        // Check if the string is not null or empty
        if (!string.IsNullOrEmpty(strValue))
        {
            return strValue.Length == 26;
        }

        // Return true if the value is null or empty
        return true;
    }

    // Override the FormatErrorMessage method to provide a custom error message.
    public override string FormatErrorMessage(string name)
    {
        return string.Format("The {0} value must be between {1} and {2} characters.", name, _minLength, _maxLength);
    }
}
