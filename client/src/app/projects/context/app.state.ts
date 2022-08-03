import { IProject } from '../types/Projects';

export interface IAppState {
    error: null | string;
    isLoading: Boolean;
    projects: Array<IProject>;
}