export interface UsersRole {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createAt: string;
}


export interface IChangeRole {
    usersId: number[];
    role: string;
}