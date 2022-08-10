import { ICreateProject } from './../../../types/Projects';
import Swal from 'sweetalert2';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService, TicketsService } from 'src/services/api.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { Users } from 'src/types/User';
import { Static } from 'src/Static';
import { ICreateTicket, ITicket } from 'src/types/Tickets';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html'
})
export class NewTicketComponent implements OnInit {

  constructor(private authService: AuthService, private ticketsService: TicketsService) { }
  matcher = new MyErrorStateMatcher();

  @Input() ticketToUpdate: ITicket | null | undefined = null;
  isUpdateTicket: boolean = false;
  ticketIdToUpdate: number | null = null;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["ticketToUpdate"].currentValue) {
      const Change = changes["ticketToUpdate"].currentValue;
      console.log(Change)
      this.ticketIdToUpdate = Change.id;
      this.isUpdateTicket = true;
      this.TicketForm.setValue({
        name: Change.name,
        description: "  ",
        type: Change.type,
        priority: Change.priority,
        assigneeToId: Math.floor((Math.random() * this.UsersList.length) + 1),
      });
    }
  }

  DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(16)]);

  NameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  AssigneeToIdFormControl = new FormControl(0, [Validators.required]);

  PriorityFormControl = new FormControl(Static.Priorates.Array[0], [Validators.required]);

  TypeFormControl = new FormControl(Static.Types.Array[0], [Validators.required]);

  ProjectId = Static.getIdParams(document.location.href);

  Priorates = Static.Priorates.Array;

  Types = Static.Types.Array;

  UsersList: Users[] = [];

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
      if (this.isUpdateTicket && this.ticketIdToUpdate) {
        this.ticketsService.UpdateTicket(form as ICreateTicket, this.ticketIdToUpdate).subscribe(m => {
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
              text: 'Ticket Updated',

              icon: 'success',
              confirmButtonText: 'Cool'
            })
          });
      } 
      else {
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
        console.log({ ...this.TicketForm.value, ProjectId: this.ProjectId });
      }
    }
  }
}