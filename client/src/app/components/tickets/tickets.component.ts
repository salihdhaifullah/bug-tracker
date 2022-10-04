import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { ITicket } from 'src/types/Tickets';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, Input, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/types/User';
import { Static } from 'src/Static';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  displayedColumns: string[] = ['devoloper', 'name', 'priority', "createdAt", "type", "completed"];
  
  dataSource = new MatTableDataSource<ITicket>();

  @Input() tickets: ITicket[] | undefined | null;

  isFound = localStorage.getItem('user')
  user: User | null = this.isFound ? JSON.parse(this.isFound) : null;
  isAdminOrProjectMangerOrSubmitter: boolean;

  @Output() newItemEvent = new EventEmitter<number>();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  _moment: any = moment;

  constructor() {
    if (this.user) this.isAdminOrProjectMangerOrSubmitter = (this.user.role === Static.Roles.Admin || this.user.role === Static.Roles.ProjectManger || this.user.role === Static.Roles.Submitter);
    else this.isAdminOrProjectMangerOrSubmitter = false;
  }

  ngOnInit(): void {

    this.tickets = [];
    if (this.isAdminOrProjectMangerOrSubmitter) this.displayedColumns.push("update");


    console.log(this.isAdminOrProjectMangerOrSubmitter);
  }

  ngAfterViewInit(): void {
    console.log(this.isAdminOrProjectMangerOrSubmitter);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tickets'] && this.tickets) {
        this.dataSource.data = this.tickets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
  }

  HandelUpdate(id: number) {
    this.newItemEvent.emit(id);
  }

}


