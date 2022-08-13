import { UsersRole } from 'src/types/Roles';
import { User } from 'src/types/User';
import { ITicket } from 'src/types/Tickets';
import { IProject } from 'src/types/Projects';
import { Comments } from 'src/types/Comments';
import { IFilles } from 'src/types/Filles';


export interface IAppState {
    isLoading: boolean;
    error: string | null;
    projects: IProject[];
    tickets: ITicket[];
    user: User | null;
    message: string | null;
    roles: UsersRole[];
    project: IProject | null;
    ticket: ITicket | null;
    comments: Comments[];
    files: IFilles[];
}