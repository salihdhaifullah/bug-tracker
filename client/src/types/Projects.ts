export interface IProject {
    name: String
    id: Number
    title: String
    isClosed: Boolean
    createdAt: String
    description: String
    closedAt: String
}

export interface ICreateProject {
    name: String
    title: String
    description: String
}