import { ICreateProject } from './../../../types/Projects';
import Swal from 'sweetalert2';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService, TicketsService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { Users } from 'src/types/User';
import { Static } from 'src/Static';
import { ICreateTicket } from 'src/types/Tickets';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html'
})
export class NewTicketComponent implements OnInit {

  constructor(private authService: AuthService, private ticketsService: TicketsService) { }
  matcher = new MyErrorStateMatcher();

  DescriptionFormControl = new FormControl<string>('', [Validators.required, Validators.minLength(16)]);
  
  NameFormControl = new FormControl<string>('', [Validators.required, Validators.minLength(4)]);
  
  AssigneeToIdFormControl = new FormControl<number>(0, [Validators.required]);
  
  PriorityFormControl = new FormControl<string>(Static.Priorates.Array[0], [Validators.required]);

  TypeFormControl = new FormControl<string>(Static.Types.Array[0], [Validators.required]); 

  ProjectId = Static.getIdParams(document.location.href); // production

  // Priority 
  Priorates = Static.Priorates.Array;
  // Type 
  Types = Static.Types.Array;

  UsersList: Users[] = [];
    // Priority Status Type Name Description AssigneeToId SubmitterId 

  TicketForm = new FormGroup({
    description: this.DescriptionFormControl,
    name: this.NameFormControl,
    assigneeToId: this.AssigneeToIdFormControl,
    priority: this.PriorityFormControl,
    type: this.TypeFormControl,
  });


  ngOnInit(): void {
    this.authService.GetUsers().subscribe(data => {
      console.log(data);
      this.UsersList = data;
    });
  }

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    if (this.TicketForm.valid) {
      const form = { ...this.TicketForm.value, projectId: this.ProjectId };
      this.ticketsService.CreateTicket(form as ICreateTicket).subscribe(m => {
        console.log(m);
      }
        , err => {
          Swal.fire({
            title: 'Error',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        , () => {
          Swal.fire({
            title: 'Success',
            text: 'Ticket created',

            icon: 'success',
            confirmButtonText: 'Cool'
          })
        });
    console.log({ ...this.TicketForm.value, ProjectId: this.ProjectId});
  }

}
}