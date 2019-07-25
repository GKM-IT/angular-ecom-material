import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PurchaseCartService } from 'src/app/providers/purchase/purchase-cart.service';
import { ProductService } from 'src/app/providers/product/product.service';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-purchase-cart-list',
  templateUrl: './purchase-cart-list.component.html',
  styleUrls: ['./purchase-cart-list.component.css']
})
export class PurchaseCartListComponent implements OnInit {
  public pageHeading = 'Purchase Cart';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;

  @Input()
  vendorId;

  isLoading = false;
  products: any = [];
  carts: any = [];
  totals: any = [];
  cartDisplayedColumns: string[] = ['product', 'product_image', 'quantity', 'price', 'tax', 'total', 'action'];


  productId;
  product: { id: any; name: any; };
  quantity;
  price;
  tax;

  public formErrors = {
    product: '',
    quantity: '',
    price: '',
    tax: '',
  };

  form: FormGroup;

  constructor(
    public masterService: PurchaseCartService,
    public productService: ProductService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.form = this.formBuilder.group({
      productId: [this.productId, Validators.required],
      product: [this.product, Validators.required],
      quantity: [this.quantity, Validators.required],
      price: [this.price, Validators.required],
      tax: [this.tax, Validators.required],
    });
    this.getProductAutocomplete();
    this.setErrors();
    this.getCarts();
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

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.form,
      this.formErrors,
      false
    );
  }

  getCarts() {
    this.masterService.list({ vendorId: this.vendorId }).subscribe(response => {
      this.carts = response.data;
      this.totals = response.totals;
    });
  }

  addCart(cartData) {
    const data = {
      vendorId: this.vendorId,
      productId: cartData.product_id,
      quantity: cartData.quantity,
      price: cartData.price,
      tax: cartData.tax,
    };

    this.masterService.save(data, 'new').subscribe(
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
    this.masterService.delete(data.id).subscribe(
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

  onCartSubmit() {
    // mark all fields as touched
    this.markFormGroupTouched();

    if (this.isFormValid()) {
      this.spinner.show();
      const data = {
        vendorId: this.vendorId,
        productId: this.form.value.productId,
        quantity: this.form.value.quantity,
        price: this.form.value.price,
        tax: this.form.value.tax,
      };

      this.masterService.save(data, 'new').subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          }
          this.getCarts();
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
