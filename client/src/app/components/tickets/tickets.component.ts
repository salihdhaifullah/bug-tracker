import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import * as Actions from 'src/context/actions';
import { isLoadingSelector, errorSelector, ticketsSelector } from 'src/context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITicket } from 'src/types/Tickets';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Static } from 'src/Static';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements AfterViewInit {
  displayedColumns: string[] = ['devoloper', 'submitter', 'priority', 'status', "createdAt", "type", "updatedAt", "isCompleted"];
  dataSource = new MatTableDataSource<ITicket>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>;
  tickets$: Observable<ITicket[]>;

  constructor(private store: Store<IAppState>) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    this.error$ = this.store.pipe(select(errorSelector))
    this.tickets$ = this.store.pipe(select(ticketsSelector))
  }


  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  projectId = Static.getIdParams(document.location.href)

  ngOnInit() {





    this.store.dispatch(Actions.getTickets({ ProjectId: this.projectId }));
  }

  ngAfterViewInit() {
    this.tickets$.subscribe((data: any) => {
      if (data.tickets.length === 0 && data.isLoading === false) {
        Swal.fire(
          'No Tickets Found',
          '',
          'error'
        )
        // document.location.href = `${document.location.origin}/projects` /// need work
      }
      this.dataSource.data = data.tickets,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort,
        console.log(data)
    });

  }
}

