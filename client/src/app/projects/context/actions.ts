import { createAction, props } from "@ngrx/store";
import { IProject } from "../types/Projects";

export const getProjects = createAction("[Projects] Get Projects"); 

export const getProjectsSuccess = createAction("[Projects] Get Projects Success", props<{ projects: IProject[] }>()); 

export const getProjectsFailure = createAction("[Projects] Get Projects Failure", props<{ error: string }>()); 
