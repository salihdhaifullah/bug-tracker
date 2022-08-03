import { MatSort } from '@angular/material/sort';
import * as Actions from '../../context/actions';
import { isLoadingSelector, errorSelector, ticketsSelector } from './../../context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITicket } from 'src/types/Ticket';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<ITicket>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  tickets$: Observable<ITicket[]>; 

  constructor(private store: Store<IAppState>) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.tickets$ = this.store.pipe(select(ticketsSelector))
  }


  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator! : MatPaginator;

  ngOnInit() {
    this.store.dispatch(Actions.getTickets({ProjectId: 1}));
  }

  ngAfterViewInit() {
    this.tickets$.subscribe(p => { 
      this.dataSource.data = p,
      this.dataSource.paginator = this.paginator,
      this.dataSource.sort = this.sort
     });
     console.log(this.dataSource.data)
  }
}

  