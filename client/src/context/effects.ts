import { getProjects, getProjectsSuccess, getProjectsFailure } from './actions';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import {ProjectService} from "../services/api.service";
import { IProject } from 'src/types/Projects';


@Injectable()
export class ProjectsEffects {
    
    constructor(private actions$: Actions, private projectsService: ProjectService) { }

    
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