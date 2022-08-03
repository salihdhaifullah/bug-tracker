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

export interface ITicketState {
    tickets: ITicket[];
}