namespace Buegee.Extensions.Enums;

public enum Roles
{
    ADMIN, // can edit delete and create projects, users, roles, tickets
    PROJECT_MANGER, // can verify fixes, create and assign tasks, set priorities and deadlines, monitor progress and status, generate reports
    DEVELOPER, // can view and update bugs assigned to them, submit patches or fixes, comment on bugs
    REPORTER // report bugs,  view bugs and their details, but cannot modify or comment on them.
}
