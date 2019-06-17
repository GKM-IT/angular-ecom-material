import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationListComponent } from './information/information-list/information-list.component';
import { InformationFormComponent } from './information/information-form/information-form.component';
import { ContactTypeListComponent } from './contact-type/contact-type-list/contact-type-list.component';
import { ContactTypeFormComponent } from './contact-type/contact-type-form/contact-type-form.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';

@NgModule({
  declarations: [InformationListComponent, InformationFormComponent, ContactTypeListComponent, ContactTypeFormComponent, ContactListComponent, ContactFormComponent],
  imports: [
    CommonModule
  ]
})
export class InformationModule { }
