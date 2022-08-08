import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { ITicket } from 'src/types/Tickets';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, AfterViewInit, Input, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  displayedColumns: string[] = ['devoloper', 'submitter', 'priority', 'status', "createdAt", "type", "updatedAt", "isCompleted"];
  dataSource = new MatTableDataSource<ITicket>();

  constructor() { }

  _moment: any = moment;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  @Input() tickets: ITicket[] | undefined | null;


  ngOnInit() {
    this.tickets = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tickets']) {
      console.log(this.tickets)
      if (this.tickets) {
        this.dataSource.data = this.tickets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("qgw");
        console.log(this.tickets)
      }
    }
  }

}


