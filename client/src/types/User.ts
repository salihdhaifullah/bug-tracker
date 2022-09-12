export interface User {
    email: string;
    token: string;
    refreshToken: string;
    fullName: string;
    role: string;
    avatarUrl: string | null;
}


export interface ISinginFormData {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface ILoginFormData {
    email: string
    password: string
}


export interface Users {
    id: number;
    lastName: string;
    firstName: string;
    role: string;
}