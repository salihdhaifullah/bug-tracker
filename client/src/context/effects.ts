import { ITicket } from './../types/Ticket';
import { TicketService } from './../services/api.service';
import { getProjects, getProjectsSuccess, getProjectsFailure, getTickets, getTicketsSuccess, getTicketsFailure } from './actions';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ProjectService } from "../services/api.service";
import { IProject } from 'src/types/Projects';


@Injectable()
export class ActionsEffects {

    constructor(private actions$: Actions, private projectsService: ProjectService, private ticketService: TicketService) { }


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

    getTickets$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getTickets),
            mergeMap((action) => {
                return this.ticketService.GetTickets(action.ProjectId).pipe(
                    map((tickets: ITicket[]) => getTicketsSuccess({ tickets })),
                    catchError(error => of(getTicketsFailure({ error })))
                )
            })
        ));

}