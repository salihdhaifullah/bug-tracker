import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './singin/singin.component';
import { LoginComponent } from './login/login.component';
import { NewOrganizationComponent } from './new-organization/new-organization.component';

const routes: Routes = [
  { path: 'singin', component: SinginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-organization', component: NewOrganizationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
