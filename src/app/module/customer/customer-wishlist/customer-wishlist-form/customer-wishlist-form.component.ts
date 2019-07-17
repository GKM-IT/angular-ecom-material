import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/providers/customer/customer.service';
import { CustomerWishlistService } from 'src/app/providers/customer/customer-wishlist.service';
import { ProductService } from 'src/app/providers/product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-wishlist-form',
  templateUrl: './customer-wishlist-form.component.html',
  styleUrls: ['./customer-wishlist-form.component.css']
})
export class CustomerWishlistFormComponent implements OnInit {

  public pageHeading = 'customer Wishlist Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  product;
  productId;
  products;
  customer;
  customerId;
  customers;
  isLoading = false;

  public form: FormGroup;
  public formErrors = {
    customer: '',
    product: '',
  };

  constructor(
    public masterService: CustomerWishlistService,
    public customerService: CustomerService,
    public productService: ProductService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/customer-wishlists']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      customer: [this.customer, Validators.required],
      customerId: [this.customerId],
      product: [this.product, Validators.required],
      productId: [this.productId],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });

    this.getCustomerAutocomplete();
    this.getProductAutocomplete();
  }

  getCustomerAutocomplete() {
    const constant = new Constant();
    this.form
      .get('customer')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.customerService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.customers = res.data;
        }
      });
  }
  getProductAutocomplete() {
    const constant = new Constant();
    this.form
      .get('product')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.productService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.products = res.data;
        }
      });
  }

  onProductSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.productId.setValue(event.option.value.id);
  }
  onCustomerSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.customerId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.product = {
            id: response.data.product_id,
            name: response.data.product_name,
          };
          this.productId = response.data.product_id;
          this.customer = {
            id: response.data.customer_id,
            name: response.data.customer_name,
          };
          this.customerId = response.data.customer_id;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.form,
      this.formErrors,
      false
    );
  }

  public onSubmit() {
    // mark all fields as touched
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      this.spinner.show();
      this.masterService.save(this.form.value, this.getId()).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {
            this.form.reset();
            this.router.navigate(['/customer-wishlists']);
          }
          this.spinner.hide();
          this.snackBar.open(response.message, 'X', {
            duration: 2000,
          });
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.setErrors();
    }
  }

}
