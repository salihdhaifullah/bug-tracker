import { IAppState } from './app.state';
import { createSelector } from "@ngrx/store";

export const selectFeature = (state: IAppState) => state;

export const errorSelector = createSelector(selectFeature, state => state.error);
export const isLoadingSelector = createSelector(selectFeature, state => state.isLoading);

export const projectsSelector = createSelector(selectFeature, state => state.projects);
export const ticketsSelector = createSelector(selectFeature, state => state.tickets);
export const userSelector = createSelector(selectFeature, state => state.user);
export const messageSelector = createSelector(selectFeature, state => state.message);