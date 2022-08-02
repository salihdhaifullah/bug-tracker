import { IAppState } from './app.state';
import { createSelector } from "@ngrx/store";

export const selectFeature = (state: IAppState) => state.projects;

export const isLoadingSelector = createSelector(selectFeature, state => state.isLoading);
export const projectsSelector = createSelector(selectFeature, state => state.projects);
export const errorSelector = createSelector(selectFeature, state => state.error);

