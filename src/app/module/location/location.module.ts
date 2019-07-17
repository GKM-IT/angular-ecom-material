import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CountryListComponent } from './country/country-list/country-list.component';
import { CountryFormComponent } from './country/country-form/country-form.component';
import { ZoneListComponent } from './zone/zone-list/zone-list.component';
import { ZoneFormComponent } from './zone/zone-form/zone-form.component';
import { CityListComponent } from './city/city-list/city-list.component';
import { CityFormComponent } from './city/city-form/city-form.component';
import { LocationListComponent } from './location/location-list/location-list.component';
import { LocationFormComponent } from './location/location-form/location-form.component';


@NgModule({
  declarations: [
    CountryListComponent,
    CountryFormComponent,
    ZoneListComponent,
    ZoneFormComponent,
    CityListComponent,
    CityFormComponent,
    LocationListComponent,
    LocationFormComponent,
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
