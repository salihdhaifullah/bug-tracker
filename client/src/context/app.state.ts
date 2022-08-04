import { ITicket } from './../types/Tickets';
import { IProject } from './../types/Projects';


export interface IAppState {
    isLoading: boolean;
    error: string | null;
    projects: IProject[];
    tickets: ITicket[];
}