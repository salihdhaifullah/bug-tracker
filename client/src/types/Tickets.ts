export interface ITicket {
    devoloper: string
    submitter: string
    name: string
    priority: string
    status: string
    createdAt: string
    type: string
    updatedAt: string | null
    isCompleted: boolean
    id: number
    description: string
}



export interface ICreateTicket {
    priority: string // Select Form
    type: string // Select Form
    name: string // Text Form
    description: string // Text Array Form
    assigneeToId: number // Select Form
    projectId: number // From Query Url
}



export interface ITicketToUpdate {
    id: number;
    status: string;
  }
  