import { ITicket } from '../types/Tickets';
import { getProjects, getProjectsSuccess, getProjectsFailure, getTickets, getTicketsSuccess, getTicketsFailure } from './actions';
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { TicketsService, ProjectsService } from "../services/api.service";
import { IProject } from '../types/Projects';


@Injectable()
export class ProjectsEffects {

    constructor(private actions$: Actions, private projectsService: ProjectsService) { }


    getProjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getProjects),
            mergeMap(() => {
                return this.projectsService.GetProjects().pipe(
                    map((projects: IProject[]) => getProjectsSuccess({ projects })),
                    catchError(error => of(getProjectsFailure({ error })))
                )
            })
        ));
}

@Injectable()
export class TicketsEffects {
    
        constructor(private actions$: Actions, private ticketsService: TicketsService) { }

        getTickets$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getTickets),
            mergeMap((action) => {
                return this.ticketsService.GetTickets(action.ProjectId).pipe(
                    map((tickets: ITicket[]) => getTicketsSuccess({ tickets })),
                    catchError(error => of(getTicketsFailure({ error })))
                )
            })
        ));
}