import { TicketsService } from './../../../services/api.service';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { ITicket } from 'src/types/Tickets';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, Input, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  displayedColumns: string[] = ['devoloper', 'submitter', 'priority', "createdAt", "type", "completed", "update"];
  dataSource = new MatTableDataSource<ITicket>();

  @Input() tickets: ITicket[] | undefined | null;


  @Output() newItemEvent = new EventEmitter<number>();

  HandelUpdate(id: number) {
    this.newItemEvent.emit(id);
  }

  _moment: any = moment;

  constructor(private ticketsService: TicketsService) { }



  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;




  ngOnInit() {
    this.tickets = [];
  }
  // this.HandelUpdate(1);
  // HandelUpdate = (id: number) => {
  //   console.log(id);
  //   const ticket = this.tickets && this.tickets.find(x => x.id === id);
    
  //   // this.ticketsService.UpdateTicket(ticket, id)
  // }

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


