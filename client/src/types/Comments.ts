export interface ICreateComment {
    content: string;
}

export interface Comments {
    id: number;
    content: string;
    createdAt: Date;
    userName: string;
}