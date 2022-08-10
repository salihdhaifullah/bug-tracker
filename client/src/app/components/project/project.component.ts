import { Static } from 'src/Static';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/context/app.state';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ITicket } from 'src/types/Tickets';
import { projectSelector, ticketsSelector } from 'src/context/selectors';
import * as Actions from 'src/context/actions';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IProject } from 'src/types/Projects';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})


export class ProjectComponent implements OnInit {
  tickets$: Observable<ITicket[]>;
  project$: Observable<IProject | null>;
  tickets: ITicket[] = [];

  count: number | null = null;
  Bugs: number | null = null;
  Features: number | null =  null;

  ticketToUpdate: ITicket | null | undefined = null;
  HandelUpdate = (id: any) => {
    this.ticketToUpdate = this.tickets.find(x => x.id === id);
  }


  _moment: any = moment;

  projectData: IProject | null = null;
  projectId = Static.getIdParams(document.location.href);

  constructor(private store: Store<IAppState>) {
    this.tickets$ = this.store.pipe(select(ticketsSelector))
    this.project$ = this.store.pipe(select(projectSelector))
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.getTickets({ ProjectId: this.projectId }));
    this.store.dispatch(Actions.getProjectById({ id: this.projectId }));

    this.tickets$.subscribe((data: any) => {
      if (typeof (data.tickets) === undefined && data.isLoading === false) {
        Swal.fire(
          'No Tickets Found',
          '',
          'error'
        )
      }
      this.count = data.tickets.length;
      this.Bugs = data.tickets.filter((t: ITicket) => t.type === "Bug").length;
      if (this.count && this.Bugs) this.Features = this.count - this.Bugs; 
      this.tickets = data.tickets
      console.log(this.tickets)
    });

    this.project$.subscribe((data: any) => {
      if (typeof (data.project) === undefined && data.isLoading === false) {
        Swal.fire(
          'No Project Found',
          '',
          'error'
        )
      }
      this.projectData = data.project
      console.log(this.projectData)
    }
    );
  }

}
