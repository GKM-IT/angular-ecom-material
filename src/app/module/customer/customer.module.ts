import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { CustomerGroupListComponent } from './customer-group/customer-group-list/customer-group-list.component';
import { CustomerGroupFormComponent } from './customer-group/customer-group-form/customer-group-form.component';
import { CustomerWishlistComponent } from './customer-wishlist/customer-wishlist/customer-wishlist.component';
import { CustomerWishlistFormComponent } from './customer-wishlist/customer-wishlist-form/customer-wishlist-form.component';
import { CustomerAddressListComponent } from './customer-address/customer-address-list/customer-address-list.component';
import { CustomerAddressFormComponent } from './customer-address/customer-address-form/customer-address-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomerListComponent, CustomerFormComponent, CustomerGroupListComponent, CustomerGroupFormComponent, CustomerWishlistComponent, CustomerWishlistFormComponent, CustomerAddressListComponent, CustomerAddressFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CustomerModule { }
