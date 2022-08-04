import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, FormGroup, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ILoginFormData} from 'src/model/FormData';
import { AuthService } from 'src/services/api.service';
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


  emailFormControl = new FormControl('', [Validators.required]); // , Validators.email
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  matcher = new MyErrorStateMatcher();
  hide = true;

  loginForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });
  
  HandelSubmit = (event: Event) => {
    event.preventDefault();
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      this.auth.Login(this.loginForm.value as ILoginFormData).subscribe(
        data => {
          sessionStorage.setItem('user', JSON.stringify(data));
        });

      this.loginForm.reset()
    }
    console.log("it works")
  }
}
