import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms"
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { NgChartsModule } from 'ng2-charts';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';



import { LoginComponent } from './login/login.component';
import { SinginComponent } from './singin/singin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DefaultComponent } from './default/default.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { EmploysComponent } from './employs/employs.component';
import { ProjectComponent } from './project/project.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketsComponent } from './tickets/tickets.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SinginComponent,
    NavbarComponent,
    DefaultComponent,
    DashboardComponent,
    ProjectsComponent,
    EmploysComponent,
    ProjectComponent,
    TicketComponent,
    TicketsComponent,
    NewProjectComponent,
    NewTicketComponent,
    BarChartComponent,
    LineChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    NgChartsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// ng g c MyComponent --style none