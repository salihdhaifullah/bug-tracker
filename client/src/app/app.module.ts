import { projectsReducers, ticketsReducers, userReducers } from './../context/reducer';
import { AuthService } from './../services/api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { LoginComponent } from './components/login/login.component';
import { SinginComponent } from './components/singin/singin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmploysComponent } from './components/employs/employs.component';
import { ProjectComponent } from './components/project/project.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import {TicketsComponent} from './components/tickets/tickets.component';
import { ProjectsComponent } from './components/projects/projects.component';

import { EffectsModule, EffectsRootModule } from '@ngrx/effects';
import { AuthEffects, ProjectsEffects, TicketsEffects } from 'src/context/effects';
import { ProjectsService, TicketsService } from 'src/services/api.service';
import { BearerService } from 'src/services/bearer.service';
import { AssigneUserComponent } from './components/assigne-user/assigne-user.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SinginComponent,
    NavbarComponent,
    DefaultComponent,
    DashboardComponent,
    EmploysComponent,
    ProjectComponent,
    TicketComponent,
    NewProjectComponent,
    NewTicketComponent,
    BarChartComponent,
    LineChartComponent,
    TicketsComponent,
    ProjectsComponent,
    AssigneUserComponent,
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerWhenStable:30000'}),
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
    StoreModule.forRoot({}),
    StoreModule.forFeature('projects', projectsReducers),
    StoreModule.forFeature('tickets', ticketsReducers),
    StoreModule.forFeature('user', userReducers),
    EffectsModule.forFeature([ProjectsEffects, TicketsEffects, AuthEffects]),
    EffectsModule.forRoot([]),
    EffectsRootModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, autoPause: true }),
  ],
  providers: [ProjectsService, TicketsService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: BearerService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }