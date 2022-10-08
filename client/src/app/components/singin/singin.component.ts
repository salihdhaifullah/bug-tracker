import { Router } from '@angular/router';
import { ISinginFormData } from 'src/types/User';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { User } from 'src/types/User';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import {FormControl, FormGroup,  Validators} from '@angular/forms';
import * as Actions from 'src/context/actions';
import { isLoadingSelector, userSelector, errorSelector } from 'src/context/selectors';
import { MyErrorStateMatcher } from '../../MyErrorStateMatcher';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html'
})
export class SinginComponent  {

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  user$: Observable<User | null>; 

  constructor(private store: Store<IAppState>, private router: Router) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    this.error$ = this.store.pipe(select(errorSelector))
    this.user$ = this.store.pipe(select(userSelector))
  }

  emailFormControl = new FormControl<string>('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl<string>('', [Validators.required, Validators.minLength(6)]);
  firstNameFormControl = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);
  lastNameFormControl = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);

  matcher = new MyErrorStateMatcher();
  hide = true;

  singinForm = new FormGroup({
    email: this.emailFormControl, 
    password: this.passwordFormControl,
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl
  });


  ngOnInit() {
    this.user$.subscribe((data: any) => {
      console.log(data.user)
    });
  }
  HandelRedirect() { this.router.navigate(["login"]) };

  HandelSubmit = async (event: Event) => {
    event.preventDefault();
    this.store.dispatch(Actions.Logout());

    if (this.emailFormControl.valid && this.passwordFormControl.valid  && this.firstNameFormControl.valid && this.lastNameFormControl.valid) {
      const hello = this.store.dispatch(Actions.postSingIn({SingIn: this.singinForm.value as ISinginFormData}));
      console.log(hello);
      this.user$.subscribe((data: any) => { 
        console.log(data.user)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          Swal.fire({
            title: 'Success',
            text: 'You have been registered',
            icon: 'success',
            confirmButtonText: 'OK',
          })
          this.router.navigate([""])
        }
       }, (error: any) => {
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'OK',
          });
      });
    }
  }

}  
