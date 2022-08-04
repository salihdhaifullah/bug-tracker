// import { ICreateProjectFormData } from './../../model/FormData';
// import { ProjectService } from './../../services/my-test.service';
import { Component } from '@angular/core';
import {FormControl,  FormGroup,  Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../MyErrorStateMatcher';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html'
})
export class NewProjectComponent  {


// constructor(private Project: ProjectService) {}

  matcher = new MyErrorStateMatcher();

  DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  NameFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  TitleFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  toppingsFormControl = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  ProjectForm = new FormGroup({
    Description: this.DescriptionFormControl,
    Name: this.NameFormControl,
    Title: this.TitleFormControl,
    toppings: this.toppingsFormControl,
  });
  
  HandelSubmit = (event: Event) => {
    // event.preventDefault();
    // if (this.ProjectForm.valid) {
    //   this.Project.CreateProject(this.ProjectForm.value as ICreateProjectFormData).subscribe(
    //     data => {
    //       console.log(data)
    //     }
    //   )
    //   this.ProjectForm.reset()
    // }
    console.log("qwf")
  }
}
