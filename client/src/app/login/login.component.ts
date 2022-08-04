import { isLoadingSelector, errorSelector, userSelector } from 'src/context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { User } from './../../types/User';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, FormGroup, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ILoginFormData} from 'src/model/FormData';
import * as Actions from 'src/context/actions';
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

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  user$: Observable<User | null>; 

  constructor(private store: Store<IAppState>) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    this.error$ = this.store.pipe(select(errorSelector))
    this.user$ = this.store.pipe(select(userSelector))
  }

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
      this.store.dispatch(Actions.postLogin({Login: this.loginForm.value as ILoginFormData}));
    }


  }

  ngAfterViewInit() {
    this.user$.subscribe((data: any) => { 
      console.log(data.user)
     });  
  }

}
