export interface IMember {
    joinedAt: string;
    email: string;
    role: string;
    name: string;
    imageUrl: string;
    id: string;
}

export interface IProject {
    id: string;
    createdAt: string;
    name: string;
    markdown: string;
    owner: {
        imageUrl: string;
        name: string;
        id: string;
    };
}
