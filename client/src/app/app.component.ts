import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Logout } from 'src/context/actions';
import { IAppState } from 'src/context/app.state';
import { Static } from 'src/Static';
import Swal from 'sweetalert2';
import { Router } from "@angular/router"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  haveAccount = sessionStorage.getItem('user');
  user = this.haveAccount && JSON.parse(this.haveAccount);


  isExpired: boolean = false;
  isFirstTime: boolean = true;
  TimeOut: number = 3000;
  id: any = 1;

  constructor(private store: Store<IAppState>, private router: Router) { }

  ngOnInit() {
    this.TimeOut = this.isFirstTime ? 3000 : (1000 * 60 * 10);


    setTimeout(() => {
      this.isExpired = this.user?.token && Static.checkExpirationDateJwt(this.user?.token);
      if (this.isExpired || this.user === null) {
        this.user && this.store.dispatch(Logout());
        this.user && sessionStorage.removeItem('user');
        this.user = null;
        this.haveAccount = null;
        console.log("From time out")
        Swal.fire({
          title: `${this.user ? "Session Expired" : "you need To login"} `,
          text: 'Please login again',
          icon: 'error',
          confirmButtonText: 'OK',
          showCancelButton: true,
        }).then((result) => result.value && this.router.navigate(['/login']));

      }
    }, 3000); // 3000 milliseconds for first time

    this.id = setInterval(() => {

      this.isExpired = this.user?.token && Static.checkExpirationDateJwt(this.user?.token);
      if (this.isExpired || this.user === null) {

        this.user && this.store.dispatch(Logout());
        this.user && sessionStorage.removeItem('user');
        this.user = null;
        this.haveAccount = null;
        console.log("From set interval")
        Swal.fire({
          title: `${this.user ? "Session Expired" : "you need To login"} `,
          text: 'Please login again',
          icon: 'error',
          confirmButtonText: 'OK',
          showCancelButton: true,
        }).then((result) => result.value && this.router.navigate(['/login']));

      }
    }, 1000 * 60 * 10); // every 10 minutes
  }

  ngOnDestroy() {
    clearInterval(this.id);
  }

}


