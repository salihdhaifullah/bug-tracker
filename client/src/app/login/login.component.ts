import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, FormGroup, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ILoginFormData} from 'src/model/FormData';
import { AuthService } from './../../services/my-test.service';
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

  constructor(private auth: AuthService) { }


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
      this.auth.Login(this.loginForm.value as ILoginFormData).subscribe(
        data => {
          console.log(data);
        });

      this.loginForm.reset()
    }
  }
}
