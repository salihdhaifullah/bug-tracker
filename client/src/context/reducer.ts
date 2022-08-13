import { IAppState } from 'src/context/app.state';
import { createReducer, on } from '@ngrx/store';
import * as Actions from './actions';

const isFound = sessionStorage.getItem('user');


export const initialState: IAppState = {
    isLoading: false,
    error: null,
    projects: [],
    tickets: [],
    user: isFound !== null ? JSON.parse(isFound) : null,
    message: null,
    roles: [],
    project: null,
    ticket: null,
    comments: [],
    files: []
}

const userInitialState: any = {
    isLoading: false,
    error: null,
    user: isFound ? JSON.parse(isFound) : null 
}

const projectsInitialState: any = {
    isLoading: false,
    error: null,
    projects: [],
    massage: null
}

const ticketsInitialState: any = {
    isLoading: false,
    error: null,
    tickets: [],
}

const rolesInitialState: any = {
    isLoading: false,
    error: null,
    roles: [],
}

const projectInitialState: any = {
    isLoading: false,
    error: null,
    project: null,
}

const ticketInitialState: any = {
    isLoading: false,
    error: null,
    ticket: null,
}

const filesInitialState: any = {
    isLoading: false,
    error: null,
    files: [],
}

const commentsInitialState: any = {
    isLoading: false,
    error: null,
    comments: [],
}


export const userReducers = createReducer(userInitialState, 
    on(Actions.postLogin, state => ({ ...state, isLoading: true })),
    on(Actions.postLoginSuccess, (state, action) => ({ ...state, isLoading: false, user: action.user })),
    on(Actions.postLoginFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

    on(Actions.postSingIn, state => ({ ...state, isLoading: true })),
    on(Actions.postSingInSuccess, (state, action) => ({ ...state, isLoading: false, user: action.user })),
    on(Actions.postSingInFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

    on(Actions.Logout, state => { sessionStorage.removeItem('user'), ({ ...state, user: null }) }),
);



export const projectsReducers = createReducer(projectsInitialState,
    on(Actions.getProjects, state => ({ ...state, isLoading: true })),
    on(Actions.getProjectsSuccess, (state, action) => ({ ...state, isLoading: false, projects: action.projects })),
    on(Actions.getProjectsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

    on(Actions.postProject, state => ({ ...state, isLoading: true })),
    on(Actions.postProjectSuccess, (state, action) => ({ ...state, isLoading: false, massage: action.massage })),
    on(Actions.postProjectFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)

export const ticketsReducers = createReducer(ticketsInitialState,
    on(Actions.getTickets, state => ({ ...state, isLoading: true })),
    on(Actions.getTicketsSuccess, (state, action) => ({ ...state, isLoading: false, tickets: action.tickets })),
    on(Actions.getTicketsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)

export const rolesReducers = createReducer(rolesInitialState,
    on(Actions.getRoles, state => ({ ...state, isLoading: true })),
    on(Actions.getRolesSuccess, (state, action) => ({ ...state, isLoading: false, roles: action.roles })),
    on(Actions.getRolesFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)


export const projectReducers = createReducer(projectInitialState,
    on(Actions.getProjectById, state => ({ ...state, isLoading: true })),
    on(Actions.getProjectByIdSuccess, (state, action) => ({ ...state, isLoading: false, project: action.project })),
    on(Actions.getProjectByIdFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)

export const ticketReducers = createReducer(ticketInitialState,
    on(Actions.getTicketById, state => ({ ...state, isLoading: true })),
    on(Actions.getTicketByIdSuccess, (state, action) => ({ ...state, isLoading: false, ticket: action.ticket })),
    on(Actions.getTicketByIdFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)



export const filesReducers = createReducer(filesInitialState,
    on(Actions.getFiles, state => ({ ...state, isLoading: true })),
    on(Actions.getFilesSuccess, (state, action) => ({ ...state, isLoading: false, files: action.files })),
    on(Actions.getFilesFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)

export const commentsReducers = createReducer(commentsInitialState,
    on(Actions.getComments, state => ({ ...state, isLoading: true })),
    on(Actions.getCommentsSuccess, (state, action) => ({ ...state, isLoading: false, comments: action.comments })),
    on(Actions.getCommentsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
)