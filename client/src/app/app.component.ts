import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent { 
  haveAccount = sessionStorage.getItem('user');
  user = this.haveAccount && JSON.parse(this.haveAccount);
}
