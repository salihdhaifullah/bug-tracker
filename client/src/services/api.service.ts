import { ICreateTicket, ITicketToUpdate } from './../types/Tickets';
import { ISinginFormData, ILoginFormData } from '../model/FormData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICreateProject, IProject } from '.././types/Projects';
import { ITicket } from '.././types/Tickets';
import { IChangeRole } from 'src/types/Roles';
import { IFilles, IUpdateFille } from 'src/types/Filles';
import { Comments } from 'src/types/Comments';

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

  public GetToken(refreshToken: string): Observable<any> {
    return this.http.get(this.Auth + "/" + "refresh-token", {
      headers: {
        'www-authenticate': refreshToken
      }
    });
  }

}




@Injectable()
export class TicketsService {

  constructor(private http: HttpClient) { }

  private Ticket = environment.apiUrl + '/' + "Tickets";

  public GetTickets(ProjectId: number): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.Ticket + `?ProjectId=${ProjectId}`);
  }

  public CreateTicket(ticket: ICreateTicket): Observable<any> {
    return this.http.post(this.Ticket + "/" + "Create", ticket);
  }

  public GetTicketById(id: Number): Observable<ITicket> {
    return this.http.get<ITicket>(this.Ticket + "/" + "ticket" + "/" + id)
  }

  public UpdateTicket(ticket: ICreateTicket, id: number): Observable<any> {
    return this.http.patch(this.Ticket + "/" + id, ticket);
  }

  public GetDevTickets(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.Ticket + "/" + "ticket-assigned");
  }

  public UpdateDevTickets(items: ITicketToUpdate[]): Observable<any> {
    return this.http.patch(this.Ticket + "/" + "ticket-assigned", items)
  }
}




@Injectable()
export class ProjectsService {
  constructor(private http: HttpClient) { }

  private Project = environment.apiUrl + '/' + "Projects";

  public CreateProject(data: ICreateProject): Observable<any> {
    return this.http.post(this.Project + "/" + "Create", data);
  }

  public GetProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(this.Project);
  }

  public GetProjectById(id: number): Observable<IProject> {
    return this.http.get<IProject>(this.Project + "/" + id)
  }

  public UpdateProject(data: ICreateProject, id: Number): Observable<any> {
    return this.http.patch(this.Project + "/" + id, data);
  }

  public CloseProject(id: Number): Observable<any> {
    return this.http.put(this.Project + "/" + id, {});
  }


  public OpenProject(id: Number): Observable<any> {
    return this.http.put(this.Project + "/" + "open" + "/" + id, {});
  }
}



@Injectable()
export class RolesService {
  constructor(private http: HttpClient) { }
  private Role = environment.apiUrl + '/' + "Roles";

  public GetUsersRoles(): Observable<any> {
    return this.http.get(this.Role);
  }

  public ChangeRoles(data: IChangeRole): Observable<any> {
    return this.http.patch(this.Role, data);
  }
}

@Injectable()
export class FilesService {
  constructor(private http: HttpClient) { }

  private File = environment.apiUrl + '/' + "Files";

  public GetFiles(ticketId: number): Observable<IFilles[]> {
    return this.http.get<IFilles[]>(this.File + "/" + ticketId);
  }

  public UploadFile(formData: any, Description: string, id: number): Observable<any> {
    return this.http.post(this.File + "/" + id + `?Description=${Description}`, formData);
  }

  public DeleteFile(id: number): Observable<any> {
    return this.http.delete(this.File + "/" + id);
  }

  public UpdateFile(data: IUpdateFille, id: number): Observable<any> {
    return this.http.patch(this.File + "/" + id, data);
  }

  public UploadAvatar(formData: any): Observable<any> {
    return this.http.patch(this.File + "/" + "avatar", formData);
  }

}


@Injectable()
export class CommentsService {
  constructor(private http: HttpClient) { }
  private Comment = environment.apiUrl + '/' + "Comments";

  public GetComments(ticketId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(this.Comment + "/" + ticketId);
  }

  public CreateComment(comment: string, ticketId: number): Observable<any> {
    return this.http.post(this.Comment + "/" + ticketId, {Content: comment});
  }

  public DeleteComment(id: number): Observable<any> {
    return this.http.delete(this.Comment + "/" + id);
  }

  public UpdateComment(comment: string, id: number): Observable<any> {
    return this.http.patch(this.Comment + "/" + id, {Content: comment});
  }

}
