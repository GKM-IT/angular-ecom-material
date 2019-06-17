import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LengthListComponent } from './length/length-list/length-list.component';
import { LengthFormComponent } from './length/length-form/length-form.component';
import { WeightListComponent } from './weight/weight-list/weight-list.component';
import { WeightFormComponent } from './weight/weight-form/weight-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LengthListComponent, LengthFormComponent, WeightListComponent, WeightFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UnitModule { }
