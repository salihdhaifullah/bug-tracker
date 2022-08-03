export interface IProject {
    name: String
    id: Number
    title: String
    isClosed: Boolean
    createdAt: String
    description: String
}

export interface IProjectState {
  projects: IProject[];
}