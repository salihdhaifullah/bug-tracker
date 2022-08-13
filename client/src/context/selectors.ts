import { IAppState } from './app.state';
import { createSelector } from "@ngrx/store";

export const selectFeature = (state: IAppState) => state;

export const errorSelector = createSelector(selectFeature, state => state.error);

export const isLoadingSelector = createSelector(selectFeature, state => state.isLoading);

export const projectsSelector = createSelector(selectFeature, state => state.projects);

export const ticketsSelector = createSelector(selectFeature, state => state.tickets);

export const userSelector = createSelector(selectFeature, state => state.user);

export const messageSelector = createSelector(selectFeature, state => state.message);

export const rolesSelector = createSelector(selectFeature, state => state.roles);

export const projectSelector = createSelector(selectFeature, state => state.project);

export const ticketSelector = createSelector(selectFeature, state => state.ticket);

export const commentsSelector = createSelector(selectFeature, state => state.comments);

export const filesSelector = createSelector(selectFeature, state => state.files);
