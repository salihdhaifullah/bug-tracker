import { createAction, props } from "@ngrx/store";
import { ILoginFormData, ISinginFormData, User } from "src/types/User";
import { ICreateProject, IProject } from "../types/Projects";
import { ITicket } from "../types/Tickets";


export const getProjects = createAction("[Projects] Get Projects"); 

export const getProjectsSuccess = createAction("[Projects] Get Projects Success", props<{ projects: IProject[] }>()); 

export const getProjectsFailure = createAction("[Projects] Get Projects Failure", props<{ error: string }>()); 

export const postProject = createAction("[Projects] post Project", props<{ project: ICreateProject }>()); 

export const postProjectSuccess = createAction("[Projects] post Project Success", props<{ massage: string }>()); 

export const postProjectFailure = createAction("[Projects] post Project Failure", props<{ error: string }>()); 


export const getTickets = createAction("[Tickets] Get Tickets", props<{ProjectId: number}>()); 

export const getTicketsSuccess = createAction("[Tickets] Get Tickets Success", props<{ tickets: ITicket[] }>()); 

export const getTicketsFailure = createAction("[Tickets] Get Tickets Failure", props<{ error: string }>()); 


export const postLogin = createAction("[Login] Post Login", props<{Login: ILoginFormData}>()); 

export const postLoginSuccess = createAction("[Login] Post Login Success", props<{ user: User }>()); 

export const postLoginFailure = createAction("[Login] Post Login Failure", props<{ error: string }>()); 


export const postSingIn = createAction("[SingIn] Post SingIn", props<{SingIn: ISinginFormData}>()); 

export const postSingInSuccess = createAction("[SingIn] Post SingIn Success", props<{ user: User }>()); 

export const postSingInFailure = createAction("[SingIn] Post SingIn Failure", props<{ error: string }>()); 


export const Logout = createAction("[Logout] Logout"); 
