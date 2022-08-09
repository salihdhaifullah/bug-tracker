import { HttpClient } from '@angular/common/http';
import * as Actions from 'src/context/actions';
import { errorSelector, isLoadingSelector } from 'src/context/selectors';
import { messageSelector } from 'src/context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { ICreateProjectFormData } from './../../model/FormData';
// import { ProjectService } from './../../services/my-test.service';
import Swal from 'sweetalert2'
import { Component, Input, SimpleChanges } from '@angular/core';
import {FormControl,  FormGroup,  Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../../MyErrorStateMatcher';
import { ICreateProject, IProject } from 'src/types/Projects';
import { ProjectsService } from 'src/services/api.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html'
})
export class NewProjectComponent  {
  @Input()  updateProject: IProject | undefined = undefined;

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  message$: Observable<string | null>;

  constructor(private store: Store<IAppState>, private projectService: ProjectsService) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.message$ = this.store.pipe(select(messageSelector));
  }

  matcher = new MyErrorStateMatcher();

  DescriptionFormControl = new FormControl(``, [Validators.required, Validators.minLength(16)]);
  NameFormControl = new FormControl(``, [Validators.required, Validators.minLength(4)]);
  TitleFormControl = new FormControl(``, [Validators.required, Validators.minLength(8)]);


  ProjectForm = new FormGroup({
    Description: this.DescriptionFormControl,
    Name: this.NameFormControl,
    Title: this.TitleFormControl
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes["updateProject"] && this.updateProject) {
      this.ProjectForm.patchValue({
        Description: this.updateProject.description,
        Name: this.updateProject.name,
        Title: this.updateProject.title
      });
    }
  }

  isLoading: boolean = false;
  
  HandelSubmit = async (event: Event) => {
    event.preventDefault();
    this.isLoading = true;
    if (this.ProjectForm.valid && !this.updateProject) {
      
    this.store.dispatch(Actions.postProject({project: this.ProjectForm.value as ICreateProject}));
    

    this.projectService.CreateProject(this.ProjectForm.value as ICreateProject).subscribe(m => {
       }, err =>  {

        Swal.fire({
          title: 'Error',
          text: err.error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        
       }, () => {

        Swal.fire({
          title: 'Success',
          text: 'Project created',
          icon: 'success',
          confirmButtonText: 'Cool'
        })

       });

       this.isLoading = false;
      this.ProjectForm.reset()
    } else if (this.ProjectForm.valid && this.updateProject) {

      this.projectService.UpdateProject(this.ProjectForm.value as ICreateProject, this.updateProject.id).subscribe(m => {
         }, err =>  {

          Swal.fire({
            title: 'Error',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          
         }, () => {

          Swal.fire({
            title: 'Success',
            text: 'Project Updated',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
  });
         
        this.isLoading = false;
        this.ProjectForm.reset()
    }
  }
}
