import { ProjectsService } from 'src/services/api.service';
import { IProject } from 'src/types/Projects';
import { isLoadingSelector, errorSelector, projectsSelector } from 'src/context/selectors';
import { Observable } from 'rxjs';
import { OnInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import * as Actions from 'src/context/actions';
import { IAppState } from 'src/context/app.state';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'name', 'projectState', 'createdAt', 'update', "close"];
  dataSource = new MatTableDataSource<IProject>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>;
  projects$: Observable<IProject[]>;
  _moment: any;
  constructor(private store: Store<IAppState>, private projectService: ProjectsService) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.projects$ = this.store.pipe(select(projectsSelector));
    this._moment = moment;
  }

  Closed: number | null = null;
  Open: number | null = null;
  Count: number | null = null;

  updateProject: IProject | undefined = undefined;

  handelUpdateProject(id: Number) {
    console.log("update" + id)
    this.updateProject = this.dataSource.data.find(x => x.id === id);
    if (this.updateProject) {
      console.log(this.updateProject);

    }
  }

  handelCloseOrOpenProject(id: Number) {
    console.log("close" + id)

    const iSCloseOrOpenProject: IProject | undefined = this.dataSource.data.find(x => x.id === id);
    if (iSCloseOrOpenProject) {
      if (iSCloseOrOpenProject.isClosed ) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to open this project',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, open it!'
        }).then((result) => {
          if (result.value) {

            this.projectService.OpenProject(id).subscribe(() => {

            }, err => {
              Swal.fire(
                'Error',
                err.error.message,
                'error'
              )
            }, () => {
              Swal.fire(
                'Opened!',
                'Your project has been opened.',
                'success'
              )
              this.store.dispatch(Actions.getProjects());
            })
          }
        })
      } else {

    Swal.fire( {
      title: 'Are you sure?',
      text: 'You want to close this project',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!'
    }).then((result) => {
      if (result.value) {

        this.projectService.CloseProject(id).subscribe((p: any) => {

        }, err => {
          Swal.fire(
            'Error',
            err.error.message,
            'error'
          )
        }, () => {
          this.store.dispatch(Actions.getProjects());
          Swal.fire({
            title: 'Project Closed',
            text: 'Project has been closed',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        })
      }
    }
    
    )}
  }
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.store.dispatch(Actions.getProjects());

  }

  ngAfterViewInit() {
    this.projects$.subscribe((p: any) => {
      this.dataSource.data = p.projects,
        this.Closed = p.projects.filter((x: IProject) => x.isClosed === true).length,
        this.Open = p.projects.filter((x: IProject) => x.isClosed === false).length,
        this.Count = p.projects.length;
      this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort,
        console.log(p);
    });
  }


}


