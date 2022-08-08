export interface User {
    email: string;
    token: string;
    fullName: string;
    role: string;
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