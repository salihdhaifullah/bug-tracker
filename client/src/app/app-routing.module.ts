import { EmploysComponent } from './components/employs/employs.component';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { ProjectComponent } from './components/project/project.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './components/singin/singin.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'singin', component: SinginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
// this is the id  `^^` for the project
  //             \\ || //
  //                ||
                  //  \\
  { path: 'project/:id', component: ProjectComponent },
// th same here  `^^` for the ticket
  //           \\ || //
  //              ||
                //  \\
  { path: 'ticket/:id', component: TicketComponent },
  { path: 'new-project', component: NewProjectComponent },
  // { path: 'new-ticket', component: NewTicketComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: "roles", component: EmploysComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
