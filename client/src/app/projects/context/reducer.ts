import { IAppState } from '../context/app.state';
import { createReducer, on } from '@ngrx/store';
import * as Actions from './actions';

export const initialState: IAppState = {
    isLoading: false,
    error: null,
    projects: []
}

export const reducers = createReducer(initialState, 

    on(Actions.getProjects, state => ({ ...state, isLoading: true })),
    on(Actions.getProjectsSuccess, (state, action) => ({ ...state, isLoading: false, projects: action.projects })),
    on(Actions.getProjectsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
    
);
