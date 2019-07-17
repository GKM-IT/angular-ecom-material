import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './app-material/app-material.module';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { PhonePipe } from './pipes/phone.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { LocationModule } from './module/location/location.module';
import { UserModule } from './module/user/user.module';

import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { CatalogModule } from './module/catalog/catalog.module';
import { CustomerModule } from './module/customer/customer.module';
import { InformationModule } from './module/information/information.module';
import { OrderModule } from './module/order/order.module';
import { ProductModule } from './module/product/product.module';
import { PurchaseModule } from './module/purchase/purchase.module';
import { TaxModule } from './module/tax/tax.module';
import { UnitModule } from './module/unit/unit.module';
import { ReportModule } from './module/report/report.module';
import { VendorModule } from './module/vendor/vendor.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminComponent,
    PhonePipe,
    FilterPipe,
    AdminSidebarComponent,
    ConfirmDialogComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CatalogModule,
    CustomerModule,
    InformationModule,
    LocationModule,
    OrderModule,
    ProductModule,
    PurchaseModule,
    TaxModule,
    UnitModule,
    UserModule,
    ReportModule,
    VendorModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
