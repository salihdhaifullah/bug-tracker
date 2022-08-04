import { ISinginFormData, ILoginFormData } from '../model/FormData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProject } from '.././types/Projects';
import { ITicket } from '.././types/Tickets';


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




@Injectable()
export class TicketsService {

  constructor(private http: HttpClient) {}
  
  private Ticket = environment.apiUrl + '/' + "Tickets";

  public GetTickets(ProjectId: number) : Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.Ticket + `?ProjectId=${ProjectId}`);
  }  
}




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



  