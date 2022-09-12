import { Static } from 'src/Static';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IFilles, IUpdateFille } from 'src/types/Filles';
import { IAppState } from 'src/context/app.state';
import { filesSelector } from 'src/context/selectors';
import * as Actions from 'src/context/actions';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { User } from 'src/types/User';
import { FilesService } from 'src/services/api.service';
import { LodingSpinnerComponent } from 'src/app/loding-spinner/loding-spinner.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
export class FilesComponent implements OnInit {
  files$: Observable<IFilles[]>;
  displayedColumns: string[] = ['type', 'Description', 'CreatedAt', 'Creator Name', 'edit', 'delete'];
  dataSource = new MatTableDataSource<IFilles>();
  _moment: any;
  userId: number | null = null;
  isLoading: boolean = false;

  isUser = localStorage.getItem('user')
  user: User | null = this.isUser && JSON.parse(this.isUser)

  constructor(private store: Store<IAppState>, private filesService: FilesService) {
    this.files$ = this.store.pipe(select(filesSelector));
    this._moment = moment;
    if (this.user?.token) this.userId = Static.getIdFromJwtToken(this.user?.token);
  }

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit(): void {
    this.store.dispatch(Actions.getFiles({ TicketId: Static.getIdParams(document.location.href) }));

    this.files$.subscribe((f: any) => {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.dataSource.data = f.files
    });

  }

  handelDeleteFile(FileId: number) {
    
    Swal.fire({
      title: 'warning',
      icon: 'warning',
      text: 'do You want to delete',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.filesService.DeleteFile(FileId).subscribe(b => { }, err => Swal.fire('error', 'something wan wrong', 'error'), () => {
          Swal.fire('Success', undefined, 'success')
          this.isLoading = false;
          this.store.dispatch(Actions.getFiles({ TicketId: Static.getIdParams(document.location.href) }));
        })
      }
    });

  }

  async handelUpdateFile(FileId: number) {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'description',
      inputPlaceholder: 'Type your description here...',
      inputAttributes: {
        'aria-label': 'Type your description here'
      },
      showCancelButton: true
    })

    if (text) {
      this.isLoading = true;
      this.filesService.UpdateFile({ Description: text } as IUpdateFille, FileId).subscribe(ob => { }, err => Swal.fire('error', '<h2>something want wrong</h2>', 'error'), () => {
      Swal.fire('Success', undefined, 'success')
      this.isLoading = false;
      this.store.dispatch(Actions.getFiles({ TicketId: Static.getIdParams(document.location.href) }));
    });
  }

  }
}
