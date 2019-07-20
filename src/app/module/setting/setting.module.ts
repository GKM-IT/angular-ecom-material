import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingFormComponent } from './setting-form/setting-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SettingModule { }
