import { getProjects, getProjectsSuccess, getProjectsFailure } from './actions';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ProjectsService } from "../services/projects.service";
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