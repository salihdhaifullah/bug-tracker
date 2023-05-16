namespace Buegee.Utils.Enums;

public enum Roles
{
    admin, // can edit delete and create projects, users, roles, tickets
    project_manger, // can verify fixes, create and assign tasks, set priorities and deadlines, monitor progress and status, generate reports
    developer, // can view and update bugs assigned to them, submit patches or fixes, comment on bugs
    reporter // report bugs,  view bugs and their details, but cannot modify or comment on them.
}
