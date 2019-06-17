import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyListComponent } from './currency/currency-list/currency-list.component';
import { CurrencyFormComponent } from './currency/currency-form/currency-form.component';
import { TypeListComponent } from './type/type-list/type-list.component';
import { TypeFormComponent } from './type/type-form/type-form.component';
import { BannerListComponent } from './banner/banner-list/banner-list.component';
import { BannerFormComponent } from './banner/banner-form/banner-form.component';
import { RatingListComponent } from './rating/rating-list/rating-list.component';
import { RatingFormComponent } from './rating/rating-form/rating-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CurrencyListComponent, CurrencyFormComponent, TypeListComponent, TypeFormComponent, BannerListComponent, BannerFormComponent, RatingListComponent, RatingFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CatalogModule { }
