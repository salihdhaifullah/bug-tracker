import { IAppState } from 'src/context/app.state';
import { createReducer, on } from '@ngrx/store';
import * as Actions from './actions';

const isFound = sessionStorage.getItem('user');
export const initialState: IAppState = {
    isLoading: false,
    error: null,
    projects: [],
    tickets: [],
    user: isFound ? JSON.parse(isFound) : null
}

export const reducers = createReducer(initialState, 

    on(Actions.getProjects, state => ({ ...state, isLoading: true })),
    on(Actions.getProjectsSuccess, (state, action) => ({ ...state, isLoading: false, projects: action.projects })),
    on(Actions.getProjectsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
    
    on(Actions.getTickets, state => ({ ...state, isLoading: true })),
    on(Actions.getTicketsSuccess, (state, action) => ({ ...state, isLoading: false, tickets: action.tickets })),
    on(Actions.getTicketsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

    on(Actions.postLogin, state => ({ ...state, isLoading: true })),
    on(Actions.postLoginSuccess, (state, action) => ({ ...state, isLoading: false, user: action.user })),
    on(Actions.postLoginFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

    on(Actions.postSingIn, state => ({ ...state, isLoading: true })),
    on(Actions.postSingInSuccess, (state, action) => ({ ...state, isLoading: false, user: action.user })),
    on(Actions.postSingInFailure, (state, action) => ({ ...state, isLoading: false, error: action.error }))
);
