import { AuthService } from 'src/services/api.service';
import { Component, AfterViewInit } from '@angular/core';
import { Static } from 'src/Static';
import Swal from 'sweetalert2';
import { Router } from "@angular/router"
import { User } from 'src/types/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements AfterViewInit {
  
  haveAccount = localStorage.getItem('user');
  user: User = this.haveAccount && JSON.parse(this.haveAccount);
  isExpired: boolean = false;
  id: any = 1;

  constructor(private router: Router, private authService: AuthService) { }

  SwalError() {
    Swal.fire({
      title: "you need To login",
      text: 'Please login again',
      icon: 'error',
      confirmButtonText: 'OK',
      showCancelButton: true,
    }).then((result) => result.value && this.router.navigate(['/login']));
  }

  getToken() {

    this.authService.GetToken(this.user.refreshToken).subscribe(token => {
      this.user.token = token.token;
      localStorage.setItem('user', JSON.stringify(this.user))
    }, err => {
      if (err) this.SwalError();
    })

  }

  ngAfterViewInit() {

    if (!this.user) return this.SwalError();
    if (this.user.refreshToken === null) return this.SwalError();

    if (this.user.refreshToken !== null) this.getToken()


    this.id = setInterval(() => {

      this.isExpired = Static.checkExpirationDateJwt(this.user?.token);

      if (this.user.token && this.isExpired) this.getToken();

    }, 1000 * 60 * 2); // every 2 minutes
  }

}

