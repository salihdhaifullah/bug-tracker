import { createReducer, on } from '@ngrx/store';
import {IProjectState} from '../types/Projects';
import * as Actions from './actions';

export const initialState: IProjectState = {
    isLoading: false,
    projects: [],
    error: null,
}

export const reducers = createReducer(
    initialState, 
    on(Actions.getProjects, (state) => ({ ...state, isLoading: true })),
    on(Actions.getProjectsSuccess, (state, action) => ({ ...state, isLoading: false, projects: action.projects })),
    on(Actions.getProjectsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
);
