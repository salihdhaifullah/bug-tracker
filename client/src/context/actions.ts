import { ICreateTicket } from './../types/Tickets';
import { UsersRole } from 'src/types/Roles';
import { createAction, props } from "@ngrx/store";
import { ILoginFormData, ISinginFormData, User } from "src/types/User";
import { ICreateProject, IProject } from "../types/Projects";
import { ITicket } from "../types/Tickets";
import { Comments } from 'src/types/Comments';
import { IFilles } from 'src/types/Filles';


export const getProjects = createAction("[Projects] Get Projects"); 

export const getProjectsSuccess = createAction("[Projects] Get Projects Success", props<{ projects: IProject[] }>()); 

export const getProjectsFailure = createAction("[Projects] Get Projects Failure", props<{ error: string }>()); 


export const getProjectById = createAction("[Project] Get Project By Id", props<{id: number}>()); 

export const getProjectByIdSuccess = createAction("[Project] Get Project By Id Success", props<{ project: IProject }>()); 

export const getProjectByIdFailure = createAction("[Project] Get Project By Id Failure", props<{ error: string }>()); 


export const postProject = createAction("[Projects] post Project", props<{ project: ICreateProject }>()); 

export const postProjectSuccess = createAction("[Projects] post Project Success", props<{ massage: string }>()); 

export const postProjectFailure = createAction("[Projects] post Project Failure", props<{ error: string }>()); 


export const getTickets = createAction("[Tickets] Get Tickets", props<{ProjectId: number}>()); 

export const getTicketsSuccess = createAction("[Tickets] Get Tickets Success", props<{ tickets: ITicket[] }>()); 

export const getTicketsFailure = createAction("[Tickets] Get Tickets Failure", props<{ error: string }>()); 


export const getTicketById = createAction("[Ticket] Get Ticket By Id", props<{id: number}>()); 

export const getTicketByIdSuccess = createAction("[Ticket] Get Ticket By Id Success", props<{ ticket: ITicket }>()); 

export const getTicketByIdFailure = createAction("[Ticket] Get Ticket By Id Failure", props<{ error: string }>()); 

export const postLogin = createAction("[Login] Post Login", props<{Login: ILoginFormData}>()); 

export const postLoginSuccess = createAction("[Login] Post Login Success", props<{ user: User }>()); 

export const postLoginFailure = createAction("[Login] Post Login Failure", props<{ error: string }>()); 


export const postSingIn = createAction("[SingIn] Post SingIn", props<{SingIn: ISinginFormData}>()); 

export const postSingInSuccess = createAction("[SingIn] Post SingIn Success", props<{ user: User }>()); 

export const postSingInFailure = createAction("[SingIn] Post SingIn Failure", props<{ error: string }>()); 


export const getRoles = createAction("[Roles] Get Roles"); 

export const getRolesSuccess = createAction("[Roles] Get Roles Success", props<{ roles: UsersRole[] }>()); 

export const getRolesFailure = createAction("[Roles] Get Roles Failure", props<{ error: string }>()); 



export const getComments = createAction("[Comments] Get Comments", props<{TicketId: number}>()); 

export const getCommentsSuccess = createAction("[Comments] Get Comments Success", props<{ comments: Comments[] }>()); 

export const getCommentsFailure = createAction("[Comments] Get Comments Failure", props<{ error: string }>()); 



export const getFiles = createAction("[Files] Get Files", props<{TicketId: number}>()); 

export const getFilesSuccess = createAction("[Files] Get Files Success", props<{ files: IFilles[] }>()); 

export const getFilesFailure = createAction("[Files] Get Files Failure", props<{ error: string }>()); 


export const Logout = createAction("[Logout] Logout"); 
