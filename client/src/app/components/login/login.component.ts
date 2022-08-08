import { isLoadingSelector, errorSelector, userSelector } from 'src/context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { User } from 'src/types/User';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ILoginFormData} from 'src/model/FormData';
import * as Actions from 'src/context/actions';
import { MyErrorStateMatcher } from '../../MyErrorStateMatcher';


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

  emailFormControl = new FormControl<string>('', [Validators.required, Validators.email]); //
  passwordFormControl = new FormControl<string>('', [Validators.required, Validators.minLength(6)]);

  matcher = new MyErrorStateMatcher();
  hide = true;

  loginForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });


  ngOnInit() {
    this.user$.subscribe((data: any) => {
      console.log(data.user)
    });
  }
  
  HandelSubmit = (event: Event) => {
    event.preventDefault();
    this.store.dispatch(Actions.Logout());

    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      const login = {
        Login: this.loginForm.value as ILoginFormData
      }
      this.store.dispatch(Actions.postLogin(login));

      this.user$.subscribe((data: any) => { 
        if (data.user) {
          console.log(data.user);
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
       });  
    } 
  }

  ngAfterViewInit() { 

  }

}