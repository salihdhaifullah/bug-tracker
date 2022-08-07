export interface ITicket {
    devoloper: String
    submitter: String
    name: string
    priority: String
    status: String
    createdAt: String
    type: String
    updatedAt: String | null
    isCompleted: Boolean
}



export interface ICreateTicket {
    priority: String // Select Form
    type: String // Select Form
    name: string // Text Form
    description: string // Text Array Form
    assigneeToId: number // Select Form
    projectId: number // From Query Url
}