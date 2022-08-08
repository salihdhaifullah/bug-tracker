import { Observable } from 'rxjs';
import { Static } from 'src/Static';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { IAppState } from 'src/context/app.state';
import * as Actions from 'src/context/actions';
import { ITicket } from 'src/types/Tickets';
import { ticketSelector } from 'src/context/selectors';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html'
})
export class TicketComponent  {
  ticket$: Observable<ITicket | null>;

  data: ITicket | null = null;

  constructor(private store: Store<IAppState>) {
    this.ticket$ = this.store.pipe(select(ticketSelector))
  }

  _moment: any = moment;
  ngOnInit(): void {
    this.store.dispatch(Actions.getTicketById({ id: Static.getIdParams(document.location.href) }));
    this.ticket$.subscribe((data: any) => {
      console.log(data)
      this.data = data.ticket;
    }, (err) => {
      Swal.fire(
        err.error.message || "Something went wrong",
        '',
        'error'
      )
    }, () => {
      console.log(this.data)
      console.log("complete")
    });

  }


}
