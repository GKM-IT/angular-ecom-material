import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponListComponent } from './coupon/coupon-list/coupon-list.component';
import { CouponFormComponent } from './coupon/coupon-form/coupon-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CouponListComponent, CouponFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OfferModule { }
