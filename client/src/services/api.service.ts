import { ICreateTicket } from './../types/Tickets';
import { ISinginFormData, ILoginFormData } from '../model/FormData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICreateProject, IProject } from '.././types/Projects';
import { ITicket } from '.././types/Tickets';
import { IChangeRole } from 'src/types/Roles';

@Injectable()

export class AuthService {
  constructor(private http: HttpClient) { }
  private Auth = environment.apiUrl + "/" + "Auth";
  
  public Singin(data: ISinginFormData): Observable<any> {
    return this.http.post(this.Auth + "/" + "Singin", data);
  }

  public Login(data: ILoginFormData): Observable<any> {
    return this.http.post(this.Auth + "/" + "login", data);
  }

  public GetUsers(): Observable<any> {
    return this.http.get(this.Auth + "/" + "users");
  }


}




@Injectable()
export class TicketsService {

  constructor(private http: HttpClient) {}
  
  private Ticket = environment.apiUrl + '/' + "Tickets";

  public GetTickets(ProjectId: number) : Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.Ticket + `?ProjectId=${ProjectId}`);
  }  

  public CreateTicket(ticket: ICreateTicket) : Observable<any> {
  return  this.http.post(this.Ticket + "/" + "Create", ticket);
  }

  public GetTicketById(id: Number): Observable<ITicket>{
    return this.http.get<ITicket>(this.Ticket + "/" + "ticket" + "/" + id)
  }
}




@Injectable()
export class ProjectsService {
  constructor(private http: HttpClient) {}

  private Project = environment.apiUrl + '/' + "Projects";

  public CreateProject(data: ICreateProject) : Observable<any> {
    return this.http.post(this.Project + "/" + "Create", data);
  }

  public GetProjects() : Observable<IProject[]> {
    return this.http.get<IProject[]>(this.Project);
  }

  public GetProjectById(id: number) : Observable<IProject> {
    return this.http.get<IProject>(this.Project + "/" + id)
  }

  public UpdateProject(data: ICreateProject, id: Number) : Observable<any> {
    return this.http.patch(this.Project + "/" + id, data);
  }

  public CloseProject(id: Number) : Observable<any> {
    return this.http.put(this.Project + "/" + id, {});
  }
  

  public OpenProject(id: Number) : Observable<any> {
    return this.http.put(this.Project + "/" + "open" + "/" + id, {});
  }
}



@Injectable()
export class RolesService {
  constructor(private http: HttpClient) {}
    private Role = environment.apiUrl + '/' + "Roles";

    public GetUsersRoles(): Observable<any> {
      return this.http.get(this.Role);
    }

    public ChangeRoles(data: IChangeRole): Observable<any> {
      return this.http.patch(this.Role, data);
    }
}