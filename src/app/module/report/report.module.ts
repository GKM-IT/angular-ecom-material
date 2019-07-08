import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { TotalSalesDayComponent } from './total-sales-day/total-sales-day.component';
import { TotalSalesMonthComponent } from './total-sales-month/total-sales-month.component';
import { TotalSalesYearComponent } from './total-sales-year/total-sales-year.component';
@NgModule({
  declarations: [TotalSalesComponent, TotalSalesDayComponent, TotalSalesMonthComponent, TotalSalesYearComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
  ]
})
export class ReportModule { }
