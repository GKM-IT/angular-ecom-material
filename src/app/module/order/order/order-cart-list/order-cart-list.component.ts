import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/providers/product/product.service';
import { OrderCartService } from 'src/app/providers/order/order-cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-order-cart-list',
  templateUrl: './order-cart-list.component.html',
  styleUrls: ['./order-cart-list.component.css']
})
export class OrderCartListComponent implements OnInit {
  public pageHeading = 'Order Cart List';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;

  isLoading = false;

  products: any = [];
  carts: any = [];
  cartTotals: any = [];
  displayedColumns: string[] = ['product', 'product_image', 'quantity', 'totalFinalPrice', 'totalDiscount', 'total', 'action'];

  productId;
  product: { id: any; name: any; };
  quantity;


  public formErrors = {
    product: '',
    quantity: ''
  };

  form: FormGroup;

  @Input() customerId;

  constructor(
    public productService: ProductService,
    public orderCartService: OrderCartService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private formService: FormService,
  ) { }

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.form,
      this.formErrors,
      false
    );
  }

  markFormGroupTouched() {
    this.formService.markFormGroupTouched(this.form);
  }

  isFormValid() {
    let status = false;
    if (this.form.valid) {
      status = true;
    }
    return status;
  }

  getProductAutocomplete() {
    const constant = new Constant();
    this.form
      .get('product')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.productService
            .list({
              search: value,
              pageSize: constant.autocompleteListSize,
              pageIndex: 0,
              sort_by: 'name'
            })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe(res => {
        if (res.status) {
          this.products = res.data;
        }
      });
  }

  onAutoSelectionChanged(autoId, event: MatAutocompleteSelectedEvent) {
    this.form.controls[`${autoId}`].setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.form = this.formBuilder.group({
      customerId: [this.customerId, Validators.required],
      productId: [this.productId, Validators.required],
      product: [this.product, Validators.required],
      quantity: [this.quantity, Validators.required],
    });
    this.getProductAutocomplete();
    this.getCarts();
  }

  getCarts() {
    console.log('getCarts');
    console.log('this.customerId', this.customerId);
    this.orderCartService.list({ customerId: this.customerId }).subscribe(response => {
      this.carts = response.data;
      this.cartTotals = response.totals;
    });
  }

  addCart(cartData) {
    const data = {
      customerId: this.customerId,
      productId: cartData.product_id,
      quantity: cartData.quantity,
    };

    this.orderCartService.save(data, 'new').subscribe(
      response => {
        if (!response.status) {
          if (response.result) {
            response.result.forEach((element: { id: any; text: any; }) => {
              this.formErrors[`${element.id}`] = element.text;
            });
          }
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  deleteCart(data) {
    this.orderCartService.delete(data.id).subscribe(
      response => {
        this.getCarts();
        this.snackBar.open(response.message, 'X', {
          duration: 2000,
        });
      },
      err => {
        console.error(err);
      }
    );
  }

  onSubmit() {
    // mark all fields as touched
    this.markFormGroupTouched();

    if (this.isFormValid()) {
      this.spinner.show();
      const data = {
        customerId: this.customerId,
        productId: this.form.value.productId,
        quantity: this.form.value.quantity,
      };

      this.orderCartService.save(data, 'new').subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          }
          this.spinner.hide();
          this.getCarts();
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
