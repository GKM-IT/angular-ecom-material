import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './guards/auth-guard.service';

import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CountryListComponent } from './module/location/country/country-list/country-list.component';

const adminChildRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'users', component: CountryListComponent },
  { path: 'user-groups', component: DashboardComponent },
  { path: 'user/:id', component: DashboardComponent }
];

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: adminChildRoutes,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
