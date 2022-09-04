import { Static } from 'src/Static';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FilesService } from 'src/services/api.service';
import { IFilles } from 'src/types/Filles';
import { IAppState } from 'src/context/app.state';
import { filesSelector } from 'src/context/selectors';
import * as Actions from 'src/context/actions';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
export class FilesComponent {
  files$: Observable<IFilles[]>;
  displayedColumns: string[] = ['type', 'Description', 'CreatedAt', 'Creator Name'];
  dataSource = new MatTableDataSource<IFilles>();

  constructor(private store: Store<IAppState>, private filesService: FilesService) {
    this.files$ = this.store.pipe(select(filesSelector));
  }

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  _moment: any = moment;

  isHaveData: boolean | null = null;
  ngOnInit(): void {
    console.log("it now fucking work");
    this.store.dispatch(Actions.getFiles({ TicketId: Static.getIdParams(document.location.href) }));
    this.files$.subscribe((f: any) => {
      console.log(f)
      if (typeof (f.files) === undefined && f.isLoading === false) {
        Swal.fire({
          title: 'No Files Found',
          text: '',
          icon: 'error'
        })
      } else {
        if (f.files.length >= 1) this.isHaveData = true;
        else this.isHaveData = false;
        this.dataSource.data = f.files,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      }
    }, err => {
      Swal.fire({
        title: 'Error',
        text: "Something went wrong",
        icon: 'error'
      })
    });
  }
    
}
