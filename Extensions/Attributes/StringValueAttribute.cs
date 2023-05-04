namespace Buegee.Extensions.Attributes;

[AttributeUsage(AttributeTargets.Field)]
public class StringValueAttribute : Attribute
{
    private string _value;

    public StringValueAttribute(string value)
    {
        _value = value;
    }

    public string Value
    {
        get { return _value; }
    }
}
