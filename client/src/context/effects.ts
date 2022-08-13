import { RolesService, CommentsService, FilesService } from './../services/api.service';
import { User } from './../types/User';
import { AuthService } from 'src/services/api.service';
import { ITicket } from '../types/Tickets';
import { getProjects, getProjectsSuccess, getProjectsFailure, getTickets, getTicketsSuccess, getTicketsFailure, postLoginSuccess, postSingIn, postSingInFailure, postSingInSuccess, postLoginFailure, postLogin, postProject, postProjectSuccess, postProjectFailure, getRolesSuccess, getRolesFailure, getRoles, getProjectByIdSuccess, getProjectByIdFailure, getProjectById, getTicketById, getTicketByIdFailure, getTicketByIdSuccess, getComments, getCommentsFailure, getCommentsSuccess, getFiles, getFilesSuccess, getFilesFailure } from './actions';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { TicketsService, ProjectsService } from "../services/api.service";
import { IProject } from '../types/Projects';
import { UsersRole } from 'src/types/Roles';
import { Comments } from 'src/types/Comments';
import { IFilles } from 'src/types/Filles';


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
                    map(() => postProjectSuccess({ massage: "Project created" })),
                    catchError(error => of(postProjectFailure({ error })))
                )
            }
            )
        ));

    getProjectById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getProjectById),
            mergeMap((actions) => {
                return this.projectsService.GetProjectById(actions.id).pipe(
                    map((project: IProject) => getProjectByIdSuccess({ project })),
                    catchError(error => of(getProjectByIdFailure({ error })))
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

    getTicketById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getTicketById),
            mergeMap((action) => {
                return this.ticketsService.GetTicketById(action.id).pipe(
                    map((ticket: ITicket) => getTicketByIdSuccess({ ticket })),
                    catchError(error => of(getTicketByIdFailure({ error })))
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

@Injectable()
export class RolesEffects {
    constructor(private actions$: Actions, private rolesService: RolesService) { }

    getRoles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getRoles),
            mergeMap(() => {
                return this.rolesService.GetUsersRoles().pipe(
                    map((roles: UsersRole[]) => getRolesSuccess({ roles })),
                    catchError(error => of(getRolesFailure({ error })))
                )
            })
        ));
}



@Injectable()
export class CommentsEffects {
    constructor(private actions$: Actions, private commentsService: CommentsService) { }

    getComments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getComments),
            mergeMap((action) => {
                return this.commentsService.GetComments(action.TicketId).pipe(
                    map((comments: Comments[]) => getCommentsSuccess({ comments })),
                    catchError(error => of(getCommentsFailure({ error })))
                )
            })
        ));
}


@Injectable()
export class FilesEffects {
    constructor(private actions$: Actions, private filesService: FilesService) { }

    getFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getFiles),
            mergeMap((action) => {
                return this.filesService.GetFiles(action.TicketId).pipe(
                    map((files: IFilles[]) => getFilesSuccess({ files })),
                    catchError(error => of(getFilesFailure({ error })))
                )
            })
        ));
}

