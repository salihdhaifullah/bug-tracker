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
import { User } from 'src/types/User';
import { Static } from 'src/Static';


interface Project {
  name: string
  title: string
  status: "closed" | "open"
  createdAt: string
  id: number
  description: string
}
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Title', 'State', 'CreatedAt', 'description'];
  dataSource = new MatTableDataSource<Project>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>;
  projects$: Observable<IProject[]>;
  _moment: any;

  isFound = localStorage.getItem('user')
  user: User | null = this.isFound ? JSON.parse(this.isFound) : null;
  isAdminOrProjectManger: boolean;

  Closed: number | null = null;
  Open: number | null = null;
  Count: number | null = null;
  updateProject: Project | undefined = undefined;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private store: Store<IAppState>, private projectService: ProjectsService) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.projects$ = this.store.pipe(select(projectsSelector));
    this._moment = moment;
    if (this.user) this.isAdminOrProjectManger = (this.user.role === Static.Roles.Admin || this.user.role === Static.Roles.ProjectManger);
    else this.isAdminOrProjectManger = false;
  }


  ngOnInit() {
    if (this.isAdminOrProjectManger) {
      this.displayedColumns.push("Close")
      this.displayedColumns.push("Update")
    }
    this.store.dispatch(Actions.getProjects());
    this.getProject()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  handelUpdateProject(id: Number) {
    console.log("update" + id)
    this.updateProject = this.dataSource.data.find(x => x.id === id);
    if (this.updateProject) {
      console.log(this.updateProject);

    }
  }

  handelCloseOrOpenProject(id: Number) {

    const iSCloseOrOpenProject: Project | undefined = this.dataSource.data.find(x => x.id === id);
    if (iSCloseOrOpenProject) {
      if (iSCloseOrOpenProject.status === "closed") {
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
              Swal.fire('Error', err.error.message, 'error')
            }, () => {
              Swal.fire('Opened!', 'Your project has been opened.', 'success')
              this.store.dispatch(Actions.getProjects());
            })
          }
        })
      } else {

        Swal.fire({
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
              Swal.fire('Error', err.error.message, 'error')
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
        })
      }
    }
  };

  getProject() {
    this.projects$.subscribe((p: any) => {
      for (let project of p.projects) {
        this.dataSource.data.push({createdAt: this._moment(project.createdAt).format('ll'), name: project.name, description: `${project.description.slice(0, 11)}... ` , title: project.title, id: project.id, status: project.isClosed ? "closed" : "open" })
      }
      this.Closed = p.projects.filter((x: IProject) => x.isClosed === true).length
      this.Open = p.projects.filter((x: IProject) => x.isClosed === false).length
      this.Count = p.projects.length
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    });
  };

}


