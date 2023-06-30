export interface IUser {
    firstName: string;
    lastName: string;
    imageUrl: string;
    id: string;
}

export interface IMember extends IUser {
    joinedAt: string;
    email: string;
    role: string;
}

export interface ITicket {
    createdAt: string;
    creator: IUser;
    assignedTo: IUser | null;
    name: string;
    priority: string;
    status: string;
    type: string;
    id: string;
}

export interface IActivity {
    createdAt: string;
    markdown: string;
}

export interface IProject {
    id: string;
    createdAt: string;
    name: string;
    descriptionMarkdown: string;
    owner: IUser;
    tickets: ITicket[]
    activities: IActivity[];
    members: IMember[]
}
