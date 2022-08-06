import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from '../../MyErrorStateMatcher';

@Component({
  selector: 'app-assigne-user',
  templateUrl: './assigne-user.component.html'
})
export class AssigneUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

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
    event.preventDefault();
    if (this.ProjectForm.valid) {
      console.log(this.ProjectForm.value);
      this.ProjectForm.reset()
    }
    console.log("qwf")
  }
}
