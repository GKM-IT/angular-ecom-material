import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const homeChildRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'add',
    component: DashboardComponent
  },
  {
    path: 'update/:id',
    component: DashboardComponent
  },
  {
    path: 'detail/:id',
    component: DashboardComponent
  }
];


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: homeChildRoutes,
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
