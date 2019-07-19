import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockListComponent } from './stock/stock-list/stock-list.component';
import { StockFormComponent } from './stock/stock-form/stock-form.component';
import { StockDetailComponent } from './stock/stock-detail/stock-detail.component';
import { StockStatusListComponent } from './stock-status/stock-status-list/stock-status-list.component';
import { StockStatusFormComponent } from './stock-status/stock-status-form/stock-status-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StockListComponent, StockFormComponent, StockDetailComponent, StockStatusListComponent, StockStatusFormComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class StockModule { }
