import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { errorSelector, isLoadingSelector } from './../../../context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { UsersRole } from 'src/types/Roles';
import { Users } from 'src/types/User';
import { FormControl, FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { AuthService } from 'src/services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { rolesSelector } from 'src/context/selectors';
import * as Actions from "src/context/actions"

@Component({
  selector: 'app-employs',
  templateUrl: './employs.component.html'
})
export class EmploysComponent implements OnInit {
  displayedColumns: string[] = [ "id",'email', 'name', 'role', 'createdAt'];
  dataSource = new MatTableDataSource<UsersRole>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  roles$: Observable<UsersRole[]>;
  _moment: any;

  constructor(private store: Store<IAppState>, private authService: AuthService) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.roles$ = this.store.pipe(select(rolesSelector));
    this._moment = moment;
  }
 
  matcher = new MyErrorStateMatcher();

  // DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(16)]);
  // NameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  // TitleFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  
  toppingsFormControl = new FormControl('');
  
  toppingList: Users[] = [];

  TicketForm = new FormGroup({
    // Description: this.DescriptionFormControl,
    // Name: this.NameFormControl,
    // Title: this.TitleFormControl,
    toppings: this.toppingsFormControl,
  });

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator! : MatPaginator;


  ngOnInit(): void {
    this.store.dispatch(Actions.getRoles());

    this.authService.GetUsers().subscribe(data => {
      console.log(data);
      this.toppingList = data;
    });

    this.roles$.subscribe((data: any) => {
      this.dataSource.data = data.roles,
      this.dataSource.paginator = this.paginator,
      this.dataSource.sort = this.sort,
      console.log(data);
    });

    this.isLoading$.subscribe((data: any) => {
      console.log(data);
    }
    );
  }

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    console.log(this.TicketForm.value);
  }
}

