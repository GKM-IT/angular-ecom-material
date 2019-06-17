import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxClassListComponent } from './tax-class/tax-class-list/tax-class-list.component';
import { TaxClassFormComponent } from './tax-class/tax-class-form/tax-class-form.component';
import { TaxRateListComponent } from './tax-rate/tax-rate-list/tax-rate-list.component';
import { TaxRateFormComponent } from './tax-rate/tax-rate-form/tax-rate-form.component';

@NgModule({
  declarations: [TaxClassListComponent, TaxClassFormComponent, TaxRateListComponent, TaxRateFormComponent],
  imports: [
    CommonModule
  ]
})
export class TaxModule { }
