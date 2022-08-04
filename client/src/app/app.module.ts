import { reducers } from '../context/reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { LoginComponent } from './login/login.component';
import { SinginComponent } from './singin/singin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DefaultComponent } from './default/default.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmploysComponent } from './employs/employs.component';
import { ProjectComponent } from './project/project.component';
import { TicketComponent } from './ticket/ticket.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import {TicketsComponent} from './tickets/tickets.component';
import { ProjectsComponent } from './projects/projects.component';

import { EffectsModule, EffectsRootModule } from '@ngrx/effects';
import { ProjectsEffects, TicketsEffects } from 'src/context/effects';
import { ProjectsService, TicketsService } from 'src/services/api.service';





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
    StoreModule.forRoot(reducers),
    StoreModule.forFeature('projects', reducers),
    StoreModule.forFeature('tickets', reducers),
    EffectsModule.forFeature([ProjectsEffects, TicketsEffects]),
    EffectsModule.forRoot([]),
    EffectsRootModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, autoPause: true }),
  ],
  providers: [ProjectsService, TicketsService],
  bootstrap: [AppComponent]
})
export class AppModule { }