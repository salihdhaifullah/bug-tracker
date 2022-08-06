import { Users } from 'src/types/User';
import { FormControl, FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { AuthService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employs',
  templateUrl: './employs.component.html'
})
export class EmploysComponent implements OnInit {

  constructor(private authService: AuthService) { }
  matcher = new MyErrorStateMatcher();

  // DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(16)]);
  // NameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  // TitleFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  
  toppingsFormControl = new FormControl('');
  
  toppingList: Users[] = [];

  TicketForm = new FormGroup({
    // Description: this.DescriptionFormControl,
    // Name: this.NameFormControl,
    // Title: this.TitleFormControl,
    toppings: this.toppingsFormControl,
  });


  ngOnInit(): void {
    this.authService.GetUsers().subscribe(data => {
      console.log(data);
      this.toppingList = data;
    });
  }

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    console.log(this.TicketForm.value);
  }
}

