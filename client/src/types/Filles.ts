export interface IFilles {
    id: number;
    type: string;
    Description: string;
    CreatedAt: Date;
    Url: string;
    CreatorId: number;
    fullName: number;
}

export interface ICreateFille {
    Description: string;
    file: File;
}


export interface IUpdateFille {
    Description: string;
}