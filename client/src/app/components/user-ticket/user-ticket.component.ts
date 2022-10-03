import { ITicketToUpdate } from 'src/types/Tickets';
import { Observable } from 'rxjs';
import * as Actions from 'src/context/actions';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { ITicket } from 'src/types/Tickets';
import { devTicketSelector } from 'src/context/selectors';
import { Static } from 'src/Static';
import Swal from 'sweetalert2';
import {TicketsService} from 'src/services/api.service'

@Component({
  selector: 'app-user-ticket',
  styleUrls: ["./user-ticket.component.css"],
  templateUrl: './user-ticket.component.html'
})
export class UserTicketComponent implements OnInit {
  isChanged: boolean = false;
  devTickets$: Observable<ITicket[]>;
  devTickets: ITicket[] = [];
  New: ITicket[] = [];
  Progress: ITicket[] = [];
  Done: ITicket[] = [];
  IdsChanges: number[] = [];
  data: ITicketToUpdate[] = [];
  oldData: ITicket[] = [];
  newData: ITicketToUpdate[] = [];

  constructor(private store: Store<IAppState>, private ticketsService: TicketsService) {
    this.devTickets$ = this.store.pipe(select(devTicketSelector));
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.getDevTickets());
    this.getTicketsAndFilterThem();
  }

  HandleSave() {
    Swal.fire({
      title: 'do you',
      text: 'do you want to save change',
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.SendDataToServer()
        this.resetChanges()
      } else {
        this.filterTicket();
      } // rest to database current values
    });
  }

  resetChanges() {
    this.isChanged = false
    this.filterTicket()
    this.newData = [];
    this.oldData = [];
    this.data = [];
  }

  drop(event: CdkDragDrop<ITicket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.isChanged = true;
      if (!this.IdsChanges.find((id) => id === event.container.data[0].id)) this.IdsChanges.push(event.container.data[0].id);
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

  SendDataToServer() {
    this.oldData = [...this.New, ...this.Progress, ...this.Done];

    let NewN: ITicketToUpdate[] = []
    let ProgressN: ITicketToUpdate[] = []
    let DoneN: ITicketToUpdate[] = []

    for (let item of this.New) {
      NewN.push({ id: item.id, status: Static.Statuses.New })
    }
    for (let item of this.Progress) {
      ProgressN.push({ id: item.id, status: Static.Statuses.InProgress })
    }
    for (let item of this.Done) {
      DoneN.push({ id: item.id, status: Static.Statuses.Closed })
    }

    this.newData = [...NewN, ...ProgressN, ...DoneN]

    for (let nD of this.newData) {
      if (this.IdsChanges.find((id) => id === nD.id) && nD.status !== this.oldData.find((ele) => ele.id === nD.id)?.status) {
        this.data.push({ id: nD.id, status: nD.status })
      }
    }


    const onComplete = () => {
      this.store.dispatch(Actions.getDevTickets());
      this.getTicketsAndFilterThem();
    } 

    this.ticketsService.UpdateDevTickets(this.data).subscribe({
      complete(): void { onComplete() },
      error(err): void { Swal.fire(err.data.message, undefined, 'error') }
    })

    NewN = []
    ProgressN = []
    DoneN = []
  } 

};