import { AppRoutingModule } from './app-routing.module';

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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule, EffectsRootModule } from '@ngrx/effects';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';

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
import { AppComponent } from './app.component';


import { AuthEffects, CommentsEffects, FilesEffects, ProjectsEffects, RolesEffects, TicketsEffects } from 'src/context/effects';
import { projectsReducers, ticketsReducers, userReducers, rolesReducers, projectReducers, ticketReducers, commentsReducers, filesReducers } from 'src/context/reducer';

import { ProjectsService, TicketsService, AuthService, RolesService, CommentsService, FilesService  } from 'src/services/api.service';
import { BearerService } from 'src/services/bearer.service';
import { CommentsComponent } from './components/comments/comments.component';
import { FilesComponent } from './components/files/files.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { UserTicketComponent } from './components/user-ticket/user-ticket.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CommentComponent } from './components/comment/comment.component';



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
    CommentsComponent,
    FilesComponent,
    UploadFileComponent,
    CommentFormComponent,
    UserTicketComponent,
    NotFoundComponent,
    CommentComponent,
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerWhenStable:30000'}),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatInputModule,
    DragDropModule,
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
    StoreModule.forFeature('roles', rolesReducers), 
    StoreModule.forFeature('project', projectReducers),
    StoreModule.forFeature('ticket', ticketReducers),
    StoreModule.forFeature('comments', commentsReducers),
    StoreModule.forFeature('files', filesReducers),
    EffectsModule.forFeature([CommentsEffects, FilesEffects, ProjectsEffects, TicketsEffects, AuthEffects, RolesEffects]),
    EffectsModule.forRoot([]),
    EffectsRootModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, autoPause: true }),
  ],
  providers: [FilesService, CommentsService, ProjectsService, RolesService, TicketsService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: BearerService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }