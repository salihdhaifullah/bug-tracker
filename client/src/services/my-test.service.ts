import { ISinginFormData, ILoginFormData, ICreateProjectFormData } from './../model/FormData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient) { }
  private Auth = environment.apiUrl + "/" + "Auth";

  public Singin(data: ISinginFormData): Observable<any> {
    return this.http.post(this.Auth + "/" + "Singin", data);
  }

  public Login(data: ILoginFormData): Observable<any> {
    return this.http.post(this.Auth + "/" + "login", data);
  }
}

export class ProjectService {
  constructor(private http: HttpClient) {}

  private Project = environment.apiUrl + '/' + "Projects";

  public CreateProject(data: ICreateProjectFormData) : Observable<any> {
    return this.http.post(this.Project + "/" + "Create", data);
  }
}

