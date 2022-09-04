import { Static } from 'src/Static';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/types/User';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  isFoundUser = sessionStorage.getItem('user');
  user: User = this.isFoundUser && JSON.parse(this.isFoundUser);
  isExpired = this.user && Static.checkExpirationDateJwt(this.user.token)
  HandelRedirect() {
    if (this.isExpired || !this.isFoundUser) this.router.navigate(["login"]);
    else this.router.navigate([""])
  }
  ngOnInit(): void {
  }

}
