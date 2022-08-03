import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsService } from './services/projects.service';
import { ProjectsEffects } from './context/effects';
import { reducers } from './context/reducer';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    StoreModule.forFeature('projects', reducers),
    EffectsModule.forFeature([ProjectsEffects]),
  ],
  providers: [ProjectsService],
  declarations: [ProjectsComponent],
  exports: [ProjectsComponent],
})
export class ProjectsModule {}