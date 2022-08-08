import Swal from 'sweetalert2';
import { Static } from 'src/Static';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { errorSelector, isLoadingSelector } from './../../../context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { IChangeRole, UsersRole } from 'src/types/Roles';
import { Users } from 'src/types/User';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { AuthService, RolesService } from 'src/services/api.service';
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
  displayedColumns: string[] = ['email', 'name', 'role', 'createdAt'];
  dataSource = new MatTableDataSource<UsersRole>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>;
  roles$: Observable<UsersRole[]>;
  _moment: any;

  constructor(private store: Store<IAppState>, private authService: AuthService, private rolesService: RolesService) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.roles$ = this.store.pipe(select(rolesSelector));
    this._moment = moment;
  }

  matcher = new MyErrorStateMatcher();

  usersFormControl = new FormControl('', [Validators.required]);
  userRoleFormControl = new FormControl('', [Validators.required]);
  toppingList: Users[] = [];

  usersRole = new FormGroup({
    role: this.userRoleFormControl,
    UsersId: this.usersFormControl,
  });

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  Roles = Static.Roles.Array;
  isValid: boolean = this.usersRole.valid;

  ngOnChanges() {
    this.isValid = this.usersRole.valid;
  }
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
    if (this.usersRole.valid) {
      Swal.fire(
        {

          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, change it!'
        }).then((result) => {
          if (result.value) {
            this.rolesService.ChangeRoles(this.usersRole.value as IChangeRole).subscribe(m => {
              console.log(m);
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: 'Error',
                text: 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'Ok'
              }).then(() => {
              })
            }
            , () => {

              Swal.fire({
                title: 'Success',
                text: 'Role changed',
                icon: 'success',
                confirmButtonText: 'Ok'
              })
            });
          }
        })

      console.log(this.usersRole.value);
    }
  }


}

