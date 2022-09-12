import { Router } from '@angular/router';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Static } from 'src/Static';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {

  H1Text: string = "";
  ParagraphText: string = "";

  constructor(private router: Router) { }

  NotFoundH1Text = "Looks like you've found the doorway to the great nothing";
  NotFoundParagraphText = "Sorry about that! Please visit our home page to get where you need to go.";
  
  NeedLoginParagraphText = "Sorry about that! Please Login to get where you need to go.";
  NeedLoginH1Text = "Looks like you need to login";

  isFound = localStorage.getItem('user')
  user = this.isFound && JSON.parse(this.isFound);
  isExpired = this.user?.token && Static.checkExpirationDateJwt(this.user?.token);

  HandelRedirect(): void {
    if (!this.isFound) {
      this.router.navigate(["login"])
    } else {
      this.router.navigate([""])
    }
  }

  check(): void {
    if (!this.isFound) {
      this.H1Text = this.NeedLoginH1Text;
      this.ParagraphText = this.NeedLoginParagraphText;
    } else {
      this.H1Text = this.NotFoundH1Text;
      this.ParagraphText = this.NotFoundParagraphText;
    }
  }


  ngOnInit(): void {
    this.check();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["user"]) this.check();
  }

}
