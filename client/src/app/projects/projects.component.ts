import { IProject } from 'src/types/Projects';
import { isLoadingSelector, errorSelector, projectsSelector } from 'src/context/selectors';
import { Observable } from 'rxjs';
import {OnInit , Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import * as Actions from 'src/context/actions';
import { IAppState } from 'src/context/app.state';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = [ "id",'title', 'name', 'projectState', 'createdAt'];
  dataSource = new MatTableDataSource<IProject>();

  isLoading$: Observable<Boolean>;
  error$: Observable<string | null>; 
  projects$: Observable<IProject[]>;
  _moment: any;
  constructor(private store: Store<IAppState>) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector))
    this.projects$ = this.store.pipe(select(projectsSelector));
    this._moment = moment;
  }

  

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator! : MatPaginator;

  ngOnInit() {
    this.store.dispatch(Actions.getProjects());

  }

  ngAfterViewInit() {
    this.projects$.subscribe((p: any) => { 
      this.dataSource.data = p.projects,
      this.dataSource.paginator = this.paginator,
      this.dataSource.sort = this.sort,
      console.log(p);
    });
  }


}


