import { User } from './../types/User';
import { ITicket } from './../types/Tickets';
import { IProject } from './../types/Projects';


export interface IAppState {
    isLoading: boolean;
    error: string | null;
    projects: IProject[];
    tickets: ITicket[];
    user: User | null;
    message: string | null;
}