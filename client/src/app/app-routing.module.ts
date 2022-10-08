import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { EmploysComponent } from './components/employs/employs.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { ProjectComponent } from './components/project/project.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './components/singin/singin.component';
import { LoginComponent } from './components/login/login.component';
import { UserTicketComponent } from './components/user-ticket/user-ticket.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

let routes: Routes =  [
    { path: 'singin', component: SinginComponent },
    { path: 'login', component: LoginComponent },
    { path: '', component: DashboardComponent },
    { path: 'project/:id', component: ProjectComponent },
    { path: 'ticket/:id', component: TicketComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'user-ticket', component: UserTicketComponent },
    { path: "manage-users", component: EmploysComponent },
    { path: '**', pathMatch: "full", component: NotFoundComponent },
    
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }