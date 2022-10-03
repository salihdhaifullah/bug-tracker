import { Observable } from 'rxjs';
import * as Actions from 'src/context/actions';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { ITicket } from 'src/types/Tickets';
import { devTicketSelector } from 'src/context/selectors';
import { Static } from 'src/Static';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-ticket',
  styleUrls: ["./user-ticket.component.css"],
  templateUrl: './user-ticket.component.html'
})
export class UserTicketComponent implements OnInit {
  isChanged: boolean
  devTickets$: Observable<ITicket[]>;
  devTickets: ITicket[];
  New: ITicket[];
  Progress: ITicket[];
  Done: ITicket[];

  constructor(private store: Store<IAppState>) {
    this.isChanged = false
    this.devTickets = [];
    this.New = [];
    this.Progress = [];
    this.Done = [];
    this.devTickets$ = this.store.pipe(select(devTicketSelector));
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.getDevTickets());
    this.getTicketsAndFilterThem();
  }


  HandleSave() {
    console.log(this.New);
    console.log(this.Progress);
    console.log(this.Done);
    
    Swal.fire({
      title: 'do you',
      text: 'do you want to save change',
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
      // do database stuff 
      } else this.filterTicket(); // rest to database current values
      
    });
  }



  drop(event: CdkDragDrop<ITicket[]>) {
    this.isChanged = true;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }


  getTicketsAndFilterThem(): void {
    this.devTickets$.subscribe((data: any) => {
      if (data.devTickets) {
        this.devTickets = data.devTickets;
        this.filterTicket();
      }
    });
  }

  filterTicket(): void {
    if (this.New.length !== 0) this.New = [];
    if (this.Progress.length !== 0) this.Progress = [];
    if (this.Done.length !== 0) this.Done = [];

    if (this.devTickets.length >= 1) {
      for (let devTicket of this.devTickets) {
        if (devTicket.status === Static.Statuses.New) this.New.push(devTicket);
        else if (devTicket.status === Static.Statuses.InProgress) this.Progress.push(devTicket);
        else if (devTicket.status === Static.Statuses.Closed) this.Done.push(devTicket);
        else throw new Error("data error")
      }
    }
  }

}
