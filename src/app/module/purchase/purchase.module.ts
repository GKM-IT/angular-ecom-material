import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { PurchaseFormComponent } from './purchase/purchase-form/purchase-form.component';
import { PurchaseTypeListComponent } from './purchase-type/purchase-type-list/purchase-type-list.component';
import { PurchaseTypeFormComponent } from './purchase-type/purchase-type-form/purchase-type-form.component';
import { PurchaseStatusListComponent } from './purchase-status/purchase-status-list/purchase-status-list.component';
import { PurchaseStatusFormComponent } from './purchase-status/purchase-status-form/purchase-status-form.component';
import { PurchaseCartListComponent } from './purchase-cart/purchase-cart-list/purchase-cart-list.component';
import { PurchaseCartFormComponent } from './purchase-cart/purchase-cart-form/purchase-cart-form.component';

@NgModule({
  declarations: [PurchaseListComponent, PurchaseFormComponent, PurchaseTypeListComponent, PurchaseTypeFormComponent, PurchaseStatusListComponent, PurchaseStatusFormComponent, PurchaseCartListComponent, PurchaseCartFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PurchaseModule { }
