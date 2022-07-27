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
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent  {

  constructor() { }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  matcher = new MyErrorStateMatcher();
  hide = true;

  loginForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });
  
  HandelSubmit = (event: Event) => {
    event.preventDefault();
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      console.log(this.loginForm.value);
      this.loginForm.reset()
    }
  }
}
