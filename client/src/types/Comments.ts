export interface ICreateComment {
    Content: string;
}

export interface Comments {
    id: number;
    Content: string;
    CreatedAt: Date;
    UserName: string;
}