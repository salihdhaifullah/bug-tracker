import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-ticket',
  styleUrls: ["./user-ticket.component.css"],
  templateUrl: './user-ticket.component.html'
})
export class UserTicketComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  New = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  Progress = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  
  Done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log(event.container.data, "event.container.data")
      console.log(event.previousIndex, "event.previousIndex")
      console.log(event.currentIndex, "event.currentIndex")
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log("From Else Statement")
      console.log(event.previousContainer.data, "event.previousContainer.data")
      console.log(event.container.data, "event.container.data")
      console.log(event.previousIndex, "event.previousIndex")
      console.log(event.currentIndex, "event.currentIndex")
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
