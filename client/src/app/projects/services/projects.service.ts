import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProject } from 'src/types/Projects';




@Injectable()
export class ProjectsService {
  constructor(private http: HttpClient) {}

  private Project = environment.apiUrl + '/' + "Projects";

  // public CreateProject(data: ICreateProjectFormData) : Observable<any> {
  //   return this.http.post(this.Project + "/" + "Create", data);
  // }

  public GetProjects() : Observable<IProject[]> {
    return this.http.get<IProject[]>(this.Project);
  }
}
