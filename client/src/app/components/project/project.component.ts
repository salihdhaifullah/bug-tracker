import { Static } from 'src/Static';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/context/app.state';
import { Component, OnInit } from '@angular/core';
import { ITicket } from 'src/types/Tickets';
import { projectSelector, ticketsSelector } from 'src/context/selectors';
import * as Actions from 'src/context/actions';
import * as moment from 'moment';
import { IProject } from 'src/types/Projects';
import { User } from 'src/types/User';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})


export class ProjectComponent implements OnInit {
  tickets$: Observable<ITicket[]>;
  project$: Observable<IProject | null>;
  tickets: ITicket[] = [];

  isFound = localStorage.getItem('user')
  user: User | null = this.isFound ? JSON.parse(this.isFound) : null;

  count: number | null = null;
  Bugs: number | null = null;
  Features: number | null = null;

  ticketToUpdate: ITicket | null | undefined = null;
  isAdminOrProjectMangerOrSubmitter: boolean;

  HandelUpdate = (id: any) => {
    this.ticketToUpdate = this.tickets.find(x => x.id === id);
  }

  _moment: any = moment;

  projectData: IProject | null = null;
  projectId = Static.getIdParams(document.location.href);

  constructor(private store: Store<IAppState>) {
    this.tickets$ = this.store.pipe(select(ticketsSelector))
    this.project$ = this.store.pipe(select(projectSelector))

    if (this.user) this.isAdminOrProjectMangerOrSubmitter = (this.user.role === Static.Roles.Admin || this.user.role === Static.Roles.ProjectManger || this.user.role === Static.Roles.Submitter);
    else this.isAdminOrProjectMangerOrSubmitter = false;
  }

  ngOnInit(): void {


    console.log(this.isAdminOrProjectMangerOrSubmitter);


    this.store.dispatch(Actions.getProjectById({ id: this.projectId }));
    this.store.dispatch(Actions.getTickets({ ProjectId: this.projectId }));

    this.tickets$.subscribe((data: any) => {
      this.count = data.tickets.length;
      this.Bugs = data.tickets.filter((t: ITicket) => t.type === "Bug").length;
      if (this.count && this.Bugs) this.Features = this.count - this.Bugs;
      this.tickets = data.tickets
      console.log(this.tickets)
    });

    this.project$.subscribe((data: any) => {
      this.projectData = data.project
      console.log(this.projectData)
    });
  }
}
