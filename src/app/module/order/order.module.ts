import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderFormComponent } from './order/order-form/order-form.component';
import { OrderTypeListComponent } from './order-type/order-type-list/order-type-list.component';
import { OrderTypeFormComponent } from './order-type/order-type-form/order-type-form.component';
import { OrderStatusListComponent } from './order-status/order-status-list/order-status-list.component';
import { OrderStatusFormComponent } from './order-status/order-status-form/order-status-form.component';
import { OrderCartListComponent } from './order-cart/order-cart-list/order-cart-list.component';
import { OrderCartFormComponent } from './order-cart/order-cart-form/order-cart-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderListComponent, OrderFormComponent, OrderTypeListComponent, OrderTypeFormComponent, OrderStatusListComponent, OrderStatusFormComponent, OrderCartListComponent, OrderCartFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class OrderModule { }
