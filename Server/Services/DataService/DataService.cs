using Buegee.Data;
using Buegee.DTO;
using Buegee.Services.FirebaseService;
using Buegee.Utils.Enums;
using Buegee.Models;
using System.Text;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Buegee.Services.DataService;

public class DataService : IDataService
{
    private readonly IFirebaseService _firebase;

    public DataService(IFirebaseService firebase)
    {
        _firebase = firebase;
    }

    public async Task EditContent(ContentDTO dto, Content content, DataContext ctx)
    {

        for (var i = 0; i < content.Documents.Count; i++)
        {
            var document = content.Documents[i];

            if (!dto.Markdown.Contains(document.Url))
            {
                await _firebase.Delete(document.Url);
                ctx.Documents.Remove(document);
            }
        }

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentType.webp.ToString());
                await ctx.Documents.AddAsync(new Document() { Url = imageName, Id = Ulid.NewUlid().ToString(), ContentId = content.Id });
                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, imageName);
            }
        }

        content.Markdown = dto.Markdown;
        await ctx.SaveChangesAsync();
    }

    public async Task<EntityEntry<Content>> CreateContent(ContentDTO dto, DataContext ctx)
    {
        var content = await ctx.Contents.AddAsync(new Content() { Id = Ulid.NewUlid().ToString() });

        for (var i = 0; i < dto.Files.Count; i++)
        {
            var file = dto.Files[i];

            if (dto.Markdown.Contains(file.PreviewUrl))
            {
                var imageName = await _firebase.Upload(Convert.FromBase64String(file.Base64), ContentType.webp.ToString());
                await ctx.Documents.AddAsync(new Document() { Url = imageName, Id = Ulid.NewUlid().ToString(), ContentId = content.Entity.Id });
                dto.Markdown = dto.Markdown.Replace(file.PreviewUrl, imageName);
            }
        }

        content.Entity.Markdown = dto.Markdown;

        return content;
    }

    private async Task addActivity(string projectId, string markdown, DataContext ctx)
    {
        var activityId = Ulid.NewUlid().ToString();
        var activity = new Activity() { Id = activityId, ProjectId = projectId, Content = markdown };
        await ctx.Activities.AddAsync(activity);
    }

    public Task JoinProjectActivity(string projectId, string userName, DataContext ctx)
    {
        return addActivity(projectId, $"user {userName} joined the project", ctx);
    }

    public Task CreateProjectActivity(string projectId, string projectName, DataContext ctx)
    {
        return addActivity(projectId, $"created project {projectName}", ctx);
    }

    public Task CreateTicketActivity(string projectId, string name, TicketType type, Status status, string? assignedTo, Priority priority, DataContext ctx)
    {
        var assignedToText = assignedTo != null ? $" assigned to {assignedTo}" : "";

        return addActivity(projectId, $"created ticket {name} of type {type.ToString()}{assignedToText}, status is {status.ToString()} and priority is {priority.ToString()}", ctx);
    }

    public Task UpdateTicketActivity(string projectId, string name, TicketType type, Status status, string? assignedTo, Priority priority, string? newName, TicketType? newType, Status? newStatus, string? newAssignedTo, Priority? newPriority, DataContext ctx)
    {
        var sb = new StringBuilder($"updated ticket {name}");

        AppendChange(sb, "name", name, newName);
        AppendChange(sb, "assignation", assignedTo ?? "None", newAssignedTo ?? "None");
        AppendChange(sb, "type", type.ToString(), newType?.ToString());
        AppendChange(sb, "status", status.ToString(), newStatus?.ToString());
        AppendChange(sb, "priority", priority.ToString(), newPriority?.ToString());

        return addActivity(projectId, sb.ToString(), ctx);
    }

    public Task UpdateTicketStatusActivity(string projectId, string name, Status status, Status? newStatus, DataContext ctx)
    {
        if (status != newStatus) return addActivity(projectId, $"updated ticket \"{name}\" status from {status} to {newStatus}", ctx);
        return Task.CompletedTask;
    }

    private void AppendChange(StringBuilder sb, string property, string oldValue, string? newValue)
    {
        if (newValue != null && newValue != oldValue) sb.Append($", ticket {property} updated from {oldValue} to {newValue}");
    }

    public Task DeleteTicketActivity(string projectId, string name, string by, DataContext ctx)
    {
        return addActivity(projectId, $"ticket {name} deleted by {by}", ctx);
    }

    public Task DeleteMemberActivity(string projectId, string memberName, DataContext ctx)
    {
        return addActivity(projectId, $"the member {memberName} deleted from the project", ctx);
    }

    public Task ChangeMemberRoleActivity(string projectId, string memberName, Role oldRole, Role newRole, DataContext ctx)
    {
        return addActivity(projectId, $"the member {memberName} role had been updated from {oldRole.ToString()} to {newRole.ToString()}", ctx);
    }

    public Task TransferOwnershipActivity(string projectId, string projectName, string currentOwner, string newOwner, DataContext ctx)
    {
        return addActivity(projectId, $"transferred project {projectName} from {currentOwner} to {newOwner}", ctx);
    }

    delegate string GetStatus(bool val);
    public Task ChangeVisibilityActivity(string projectId, string projectName, bool currentState, DataContext ctx)
    {
        GetStatus getStatus = val => val ? "private" : "public";
        return addActivity(projectId, $"project {projectName} visibility updated from {getStatus(currentState)} to {getStatus(!currentState)}", ctx);
    }

    public Task ArchiveProjectActivity(string projectId, string projectName, bool currentState, DataContext ctx)
    {

        GetStatus getStatus = val => val ? "archived" : "unarchive";
        return addActivity(projectId, $"project {projectName} {getStatus}", ctx);
    }

    public Task ChangeProjectNameActivity(string projectId, string oldProjectName, string newProjectName, DataContext ctx)
    {
        return addActivity(projectId, $"project updated name from {oldProjectName} to {newProjectName}", ctx);
    }
}
