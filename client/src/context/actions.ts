import { createAction, props } from "@ngrx/store";
import { IProject } from "src/types/Projects";
import { ITicket } from "src/types/Ticket";

export const getProjects = createAction("[Projects] Get Projects"); 

export const getProjectsSuccess = createAction("[Projects] Get Projects Success", props<{ projects: IProject[] }>()); 

export const getProjectsFailure = createAction("[Projects] Get Projects Failure", props<{ error: string }>()); 


export const getTickets = createAction("[Tickets] Get Tickets", props<{ProjectId: number}>()); 

export const getTicketsSuccess = createAction("[Tickets] Get Tickets Success", props<{ tickets: ITicket[] }>()); 

export const getTicketsFailure = createAction("[Tickets] Get Tickets Failure", props<{ error: string }>()); 