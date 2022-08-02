import { AuthService } from '../../services/api.service';
import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, FormGroup, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ISinginFormData } from 'src/model/FormData';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html'
})
export class SinginComponent  {

  constructor(private auth: AuthService) { }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  firstNameFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  lastNameFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  matcher = new MyErrorStateMatcher();
  hide = true;

  singinForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl
  });

  HandelSubmit = async (event: Event) => {
    event.preventDefault();
    if (this.emailFormControl.valid && this.passwordFormControl.valid  && this.firstNameFormControl.valid && this.lastNameFormControl.valid) {

      this.auth.Singin(this.singinForm.value as ISinginFormData).subscribe(
        data => {
          console.log(data);
          this.singinForm.reset()
        });

    }
  }
}  
