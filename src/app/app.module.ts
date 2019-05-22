import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMaterialModule } from './app-material/app-material.module';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { PhonePipe } from './pipes/phone.pipe';
import { FilterPipe } from './pipes/filter.pipe';

import { MatButtonModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminComponent,
    PhonePipe,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    // AppMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
