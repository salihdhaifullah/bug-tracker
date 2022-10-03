import { Observable } from 'rxjs';
import * as Actions from 'src/context/actions';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { ITicket } from 'src/types/Tickets';
import { devTicketSelector } from 'src/context/selectors';

@Component({
  selector: 'app-user-ticket',
  styleUrls: ["./user-ticket.component.css"],
  templateUrl: './user-ticket.component.html'
})
export class UserTicketComponent implements OnInit {
  isChanged: boolean
  devTickets$: Observable<ITicket[]>;
  devTickets: ITicket[] | never[];
  
  constructor(private store: Store<IAppState>) {
    this.isChanged = false
    this.devTickets = [];
    this.devTickets$ = this.store.pipe(select(devTicketSelector));
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.getDevTickets());
    this.devTickets$.subscribe((data: any) => this.devTickets = data.devTickets);
    console.log(this.devTickets);
  }


  HandleSave() {
    console.log("HandleSave");
  }

  New = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  Progress = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  Done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    this.isChanged = true;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

}
