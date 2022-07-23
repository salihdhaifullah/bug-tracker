namespace server.Models
{
    public class Issue
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public string Assignee { get; set; }
        public string Reporter { get; set; }
        public string Project { get; set; }
        public string Type { get; set; }
        public string Severity { get; set; }
        public string Created { get; set; }
        public string Updated { get; set; }
        public string Closed { get; set; }
        public string Resolution { get; set; }
        public string Milestone { get; set; }
        public string Version { get; set; }
        public string Component { get; set; }
        public string MilestoneId { get; set; }
        public string VersionId { get; set; }
        public string ComponentId { get; set; }
        public string ProjectId { get; set; }
        public string AssigneeId { get; set; }
        public string ReporterId { get; set; }
        public string TypeId { get; set; }
        public string SeverityId { get; set; }
        public string StatusId { get; set; }
        public string PriorityId { get; set; }
        public string ResolutionId { get; set; }
        public string MilestoneName { get; set; }
        public string VersionName { get; set; }
        public string ComponentName { get; set; }
        public string ProjectName { get; set; }
        public string AssigneeName { get; set; }
        public string ReporterName { get; set; }
        public string TypeName { get; set; }
        public string SeverityName { get; set; }
        public string StatusName { get; set; }
        public string PriorityName { get; set; }
        public string ResolutionName { get; set; }
        public string MilestoneIdName { get; set; }
        public string VersionIdName { get; set; }
        public string ComponentIdName { get; set; }
    }
}