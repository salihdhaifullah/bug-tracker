import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { Users } from 'src/types/User';
import { Static } from 'src/Static';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html'
})
export class NewTicketComponent implements OnInit {

  constructor(private authService: AuthService) { }
  matcher = new MyErrorStateMatcher();

  DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(16)]);
  
  NameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  
  AssigneeToIdFormControl = new FormControl('', [Validators.required]);
  
  PriorityFormControl = new FormControl(Static.Priorates.Array[0], [Validators.required]);

  TypeFormControl = new FormControl(Static.Types.Array[0], [Validators.required]); 

  ProjectId = 1; // Test

  // Priority 
  Priorates = Static.Priorates.Array;
  // Type 
  Types = Static.Types.Array;

  UsersList: Users[] = [];
    // Priority Status Type Name Description AssigneeToId SubmitterId 

  TicketForm = new FormGroup({
    Description: this.DescriptionFormControl,
    Name: this.NameFormControl,
    AssigneeToId: this.AssigneeToIdFormControl,
    Priority: this.PriorityFormControl,
    Type: this.TypeFormControl,
  });


  ngOnInit(): void {
    this.authService.GetUsers().subscribe(data => {
      console.log(data);
      this.UsersList = data;
    });
  }

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    console.log({ ...this.TicketForm.value, ProjectId: this.ProjectId});
  }

}
