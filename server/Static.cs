namespace server
{
    public class Roles
    {
        internal static readonly string Admin = "Admin";
        internal static readonly string Developer = "Developer";
        internal static readonly string Submitter = "Submitter";
        internal static readonly string ProjectManger = "ProjectManger";
    }

    public class Priorates
    {
        internal static readonly string Low = "Low";
        internal static readonly string Medium = "Medium";
        internal static readonly string High = "High";

    }
    public class Statuses
    {
        internal static readonly string New = "New";
        internal static readonly string InProgress = "In Progress";
        internal static readonly string Closed = "Closed";
    }

    public class Types 
    {
        internal static readonly string Feature = "Feature";
        internal static readonly string Bug = "Bug";
    }

}
