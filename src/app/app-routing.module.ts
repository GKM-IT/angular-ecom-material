import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './guards/auth-guard.service';

import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CountryListComponent } from './module/location/country/country-list/country-list.component';
import { CountryFormComponent } from './module/location/country/country-form/country-form.component';

import { ZoneListComponent } from './module/location/zone/zone-list/zone-list.component';
import { ZoneFormComponent } from './module/location/zone/zone-form/zone-form.component';

const adminChildRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'users', component: CountryListComponent },
  { path: 'user-groups', component: DashboardComponent },
  { path: 'user/:id', component: DashboardComponent },
  { path: 'countries', component: CountryListComponent },
  { path: 'country/:id', component: CountryFormComponent },
  { path: 'zones', component: ZoneListComponent },
  { path: 'zone/:id', component: ZoneFormComponent },
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
