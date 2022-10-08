import * as Actions from 'src/context/actions';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService, TicketsService } from 'src/services/api.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { Users } from 'src/types/User';
import { Static } from 'src/Static';
import { ICreateTicket, ITicket } from 'src/types/Tickets';
import { IAppState } from 'src/context/app.state';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html'
})
export class NewTicketComponent implements OnInit {

  constructor(private store: Store<IAppState>, private authService: AuthService, private ticketsService: TicketsService) { }
  matcher = new MyErrorStateMatcher();

  @Input() ticketToUpdate: ITicket | null | undefined = null;
  isUpdateTicket: boolean = false;
  ticketIdToUpdate: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["ticketToUpdate"].currentValue) {
      const Change = changes["ticketToUpdate"].currentValue;

      this.ticketIdToUpdate = Change.id;
      this.isUpdateTicket = true;

      this.TicketForm.setValue({
        name: Change.name,
        description: Change.description,
        type: Change.type,
        priority: Change.priority,
        assigneeToId: 1,
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
    this.authService.GetUsers().subscribe((data: Users[])  => this.UsersList = data, err => {}, () => {
      this.UsersList.filter(u => u.role === "Admin")
      console.log(this.UsersList);
    });
    
  }

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    if (this.TicketForm.valid) {
      const form = { ...this.TicketForm.value, projectId: this.ProjectId };
      if (this.isUpdateTicket && this.ticketIdToUpdate) {
        this.ticketsService.UpdateTicket(form as ICreateTicket, this.ticketIdToUpdate).subscribe(m => {
        }, err => {
          Swal.fire({
            title: 'Error',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }, () => {
          this.store.dispatch(Actions.getTickets({ ProjectId: Static.getIdParams(document.location.href) }));
          Swal.fire({
            title: 'Success',
            text: 'Ticket Updated',
            icon: 'success',
            confirmButtonText: 'Cool'
          })
        });
        this.TicketForm.reset();
      }
      else {
        this.ticketsService.CreateTicket(form as ICreateTicket).subscribe(m => {
        }, err => {
          Swal.fire({
            title: 'Error',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }, () => {
          this.store.dispatch(Actions.getTickets({ ProjectId: Static.getIdParams(document.location.href) }));
        });
        this.TicketForm.reset();
      }
    }
  }
}