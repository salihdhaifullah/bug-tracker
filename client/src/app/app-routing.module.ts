import { NewProjectComponent } from './new-project/new-project.component';
import { TicketComponent } from './ticket/ticket.component';
import { ProjectComponent } from './project/project.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './singin/singin.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'singin', component: SinginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path: 'project', component: ProjectComponent},
  {path: 'ticket', component: TicketComponent},
  { path: 'new-project', component: NewProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
