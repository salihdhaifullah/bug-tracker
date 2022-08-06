import { User } from './../types/User';
import { AuthService } from 'src/services/api.service';
import { ITicket } from '../types/Tickets';
import { getProjects, getProjectsSuccess, getProjectsFailure, getTickets, getTicketsSuccess, getTicketsFailure, postLoginSuccess, postSingIn, postSingInFailure, postSingInSuccess, postLoginFailure, postLogin, postProject, postProjectSuccess, postProjectFailure } from './actions';
import { Injectable } from "@angular/core";
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

        createProject$ = createEffect(() =>
            this.actions$.pipe(
                ofType(postProject),
                mergeMap((actions) => {
                    return this.projectsService.CreateProject(actions.project).pipe(
                        map(() => postProjectSuccess({ massage: "Project created" })  ),
                        catchError(error => of(postProjectFailure({ error })))
                    )
                }
                )
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


@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService) { }

    postLogin$ = createEffect(() => 
        this.actions$.pipe(
            ofType(postLogin),
            mergeMap((action) => {
                return this.authService.Login(action.Login).pipe(
                    map((user: User) => postLoginSuccess({ user })),
                    catchError(error => of(postLoginFailure({ error })))
                )
            })
        ));

    postSingIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(postSingIn),
            mergeMap((action) => {
                return this.authService.Singin(action.SingIn).pipe(
                    map((user: User) => postSingInSuccess({ user })),
                    catchError(error => of(postSingInFailure({ error })))
                )
            })
        ));
}