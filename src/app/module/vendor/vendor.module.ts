import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor/vendor-form/vendor-form.component';
import { VendorGroupListComponent } from './vendor-group/vendor-group-list/vendor-group-list.component';
import { VendorGroupFormComponent } from './vendor-group/vendor-group-form/vendor-group-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [VendorListComponent, VendorFormComponent, VendorGroupListComponent, VendorGroupFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VendorModule { }
