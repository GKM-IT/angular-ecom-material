import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CountryListComponent } from './country/country-list/country-list.component';
import { CountryFormComponent } from './country/country-form/country-form.component';
import { ZoneListComponent } from './zone/zone-list/zone-list.component';
import { ZoneFormComponent } from './zone/zone-form/zone-form.component';
import { AppMaterialModule } from '../../app-material/app-material.module';
@NgModule({
  declarations: [CountryListComponent, CountryFormComponent, ZoneListComponent, ZoneFormComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    AppMaterialModule
  ]
})
export class LocationModule { }
