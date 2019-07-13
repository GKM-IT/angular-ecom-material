import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryFormComponent } from './category/category-form/category-form.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ManufactureListComponent } from './manufacture/manufacture-list/manufacture-list.component';
import { ManufactureFormComponent } from './manufacture/manufacture-form/manufacture-form.component';
import { ProductReviewListComponent } from './product-review/product-review-list/product-review-list.component';
import { ProductReviewFormComponent } from './product-review/product-review-form/product-review-form.component';
import { AttributeListComponent } from './attribute/attribute-list/attribute-list.component';
import { AttributeFormComponent } from './attribute/attribute-form/attribute-form.component';
import { AttributeGroupFormComponent } from './attribute-group/attribute-group-form/attribute-group-form.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttributeGroupListComponent } from './attribute-group/attribute-group-list/attribute-group-list.component';

@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent, ProductListComponent, ProductFormComponent, ManufactureListComponent, ManufactureFormComponent, ProductReviewListComponent, ProductReviewFormComponent, AttributeListComponent, AttributeFormComponent, AttributeGroupFormComponent, AttributeGroupListComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
