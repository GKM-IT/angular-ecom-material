import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserGroupListComponent } from './user-group/user-group-list/user-group-list.component';
import { UserGroupFormComponent } from './user-group/user-group-form/user-group-form.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';

@NgModule({
  declarations: [
    UserGroupListComponent,
    UserGroupFormComponent,
    UserListComponent,
    UserFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
