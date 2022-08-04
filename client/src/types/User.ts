export interface User {
    email: string;
    token: string;
    fullName: string;
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
