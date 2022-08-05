import * as Actions from 'src/context/actions';
import { errorSelector, isLoadingSelector } from 'src/context/selectors';
import { messageSelector } from 'src/context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { ICreateProjectFormData } from './../../model/FormData';
// import { ProjectService } from './../../services/my-test.service';
import Swal from 'sweetalert2'
import { Component } from '@angular/core';
import {FormControl,  FormGroup,  Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../MyErrorStateMatcher';
import { ICreateProject } from 'src/types/Projects';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html'
})
export class NewProjectComponent  {

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  message$: Observable<string | null>;

  constructor(private store: Store<IAppState>) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.message$ = this.store.pipe(select(messageSelector));
  }

// constructor(private Project: ProjectService) {}

  matcher = new MyErrorStateMatcher();

  DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(16)]);
  NameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  TitleFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  // toppingsFormControl = new FormControl('');
  // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  ProjectForm = new FormGroup({
    Description: this.DescriptionFormControl,
    Name: this.NameFormControl,
    Title: this.TitleFormControl,
    // toppings: this.toppingsFormControl,
  });
  
  HandelSubmit = async (event: Event) => {
    event.preventDefault();

    if (this.ProjectForm.valid) {
      
    this.store.dispatch(Actions.postProject({project: this.ProjectForm.value as ICreateProject}));
      
    
        this.error$.subscribe((m: any) => { 
          console.log(m);
        });

      this.ProjectForm.reset()
    }
  }
}
