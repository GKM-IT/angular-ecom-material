import { Component, OnInit } from '@angular/core';
import { ProductReviewService } from 'src/app/providers/product/product-review.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/providers/product/product.service';
import { CustomerService } from 'src/app/providers/customer/customer.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { RatingService } from 'src/app/providers/catalog/rating.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-review-form',
  templateUrl: './product-review-form.component.html',
  styleUrls: ['./product-review-form.component.css']
})
export class ProductReviewFormComponent implements OnInit {

  public pageHeading = 'Product Review Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  productId;
  products;
  product;
  customerId;
  customers;
  customer;
  ratingId;
  ratings;
  rating;
  text;

  isLoading = false;


  public form: FormGroup;
  public formErrors = {
    product: '',
    customer: '',
    rating: '',
    text: '',
  };

  constructor(
    public masterService: ProductReviewService,
    public productService: ProductService,
    public customerService: CustomerService,
    public ratingService: RatingService,
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
    this.router.navigate(['/product-reviews']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      product: [this.product, Validators.required],
      productId: [this.productId, Validators.required],
      customer: [this.customer, Validators.required],
      customerId: [this.customerId, Validators.required],
      rating: [this.rating, Validators.required],
      ratingId: [this.ratingId, Validators.required],
      text: [this.text, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });

    this.getProductAutocomplete();
    this.getCustomerAutocomplete();
    this.getRatingAutocomplete();
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

  getRatingAutocomplete() {
    const constant = new Constant();
    this.form
      .get('rating')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.ratingService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.ratings = res.data;
        }
      });
  }

  onProductSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.productId.setValue(event.option.value.id);
  }
  onCustomerSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.customerId.setValue(event.option.value.id);
  }
  onRatingSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.ratingId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.productId = response.data.product_id;
          this.product = {
            id: response.data.product_id,
            name: response.data.product,
          };
          this.ratingId = response.data.rating_id;
          this.rating = {
            id: response.data.rating_id,
            name: response.data.rating,
          };
          this.customerId = response.data.customer_id;
          this.customer = {
            id: response.data.customer_id,
            name: response.data.customer,
          };
          this.text = response.data.text;
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
            this.router.navigate(['/product-reviews']);
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
