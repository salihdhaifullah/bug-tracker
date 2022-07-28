import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, FormGroup, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-new-organization',
  templateUrl: './new-organization.component.html'
})
export class NewOrganizationComponent  {

  constructor() { }
  
  NameFormControl = new FormControl('', [Validators.required]);
  DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(10)]);
  LogoFormControl = new FormControl('');

  HandelSubmit = (event: Event) => {
    console.log(event);
  }
}
