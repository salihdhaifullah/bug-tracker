export interface IProject {
    name: string
    id: number
    title: string
    isClosed: boolean
    createdAt: string
    description: string
    closedAt: string
}

export interface ICreateProject {
    name: string
    title: string
    description: string
}