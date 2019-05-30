import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryListComponent } from './country/country-list/country-list.component';
import { CountryFormComponent } from './country/country-form/country-form.component';
import { ZoneListComponent } from './zone/zone-list/zone-list.component';
import { ZoneFormComponent } from './zone/zone-form/zone-form.component';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CountryListComponent,
    CountryFormComponent,
    ZoneListComponent,
    ZoneFormComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class LocationModule { }
