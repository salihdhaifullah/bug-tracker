import Swal from 'sweetalert2';
import { Static } from 'src/Static';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { errorSelector, isLoadingSelector } from './../../../context/selectors';
import { IAppState } from 'src/context/app.state';
import { Store, select } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { IChangeRole, UsersRole } from 'src/types/Roles';
import { User, Users } from 'src/types/User';
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
  isFound = localStorage.getItem('user')
  user: User | null = this.isFound ? JSON.parse(this.isFound) : null;
  
  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>;
  roles$: Observable<UsersRole[]>;
  _moment: any;
  developersCount: number = 0;
  SubmitterCount: number = 0;
  ProjectMangersCount: number = 0;

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

  Roles = Static.Roles.Array.filter((roll) => roll !== Static.Roles.Admin);
  isValid: boolean = this.usersRole.valid;

  ngOnChanges() {
    this.isValid = this.usersRole.valid;
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.getRoles());

    this.authService.GetUsers().subscribe(data => this.toppingList = data);

    this.roles$.subscribe((data: any) => {
      const Rolls: UsersRole[] = data.roles; 
      if (Rolls.length) {
        for(let roll of Rolls) {
          if (roll.role === Static.Roles.Developer) this.developersCount++;
          else if (roll.role === Static.Roles.Submitter) this.SubmitterCount++;
          else if (roll.role === Static.Roles.ProjectManger) this.ProjectMangersCount++;
          else if (roll.role === Static.Roles.Admin) null;
          else throw new Error("unValid data");
        }
      }
      this.dataSource.data = data.roles;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    if (this.usersRole.valid) {
      Swal.fire({
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
          }, (err) => {
           if (err)  Swal.fire('Error', '<h2>Something went wrong</h2>', 'error');
          }, () => {
            Swal.fire('Success', 'Role changed', 'success')
          });
        }
      })
    }
  }

}

