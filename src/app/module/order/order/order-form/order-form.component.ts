import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/providers/order/order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderTypeService } from 'src/app/providers/order/order-type.service';
import { CustomerService } from 'src/app/providers/customer/customer.service';
import { OrderStatusService } from 'src/app/providers/order/order-status.service';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { OrderCartService } from 'src/app/providers/order/order-cart.service';
import { ProductService } from 'src/app/providers/product/product.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  public pageHeading = 'Order Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;

  isLoading = false;

  orderTypes: any = [];
  orderStatuses: any = [];
  customers: any = [];
  addresses: any = [];
  products: any = [];
  carts: any = [];
  cartDisplayedColumns: string[] = ['product', 'product_image', 'quantity', 'totalFinalPrice', 'totalDiscount', 'total', 'action'];

  orderTypeId;
  orderType: { id: any; name: any; };
  customerId;
  customer: { id: any; name: any; };
  addressId;
  address: { id: any; address: any; };
  orderStatusId;
  orderStatus: { id: any; name: any; };
  comment;


  productId;
  product: { id: any; name: any; };
  quantity;

  public formErrors = {
    customerId: '',
    customer: '',
    addressId: '',
    address: '',
    orderTypeId: '',
    orderType: '',
    orderStatusId: '',
    orderStatus: '',
    comment: '',
    product: '',
    quantity: ''
  };

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    public masterService: OrderService,
    public orderTypeService: OrderTypeService,
    public orderStatusService: OrderStatusService,
    public customerService: CustomerService,
    public orderCartService: OrderCartService,
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
    this.router.navigate(['/orders']);
  }

  getOrderTypeAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('orderType')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.orderTypeService
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
          this.orderTypes = res.data;
        }
      });
  }

  getOrderStatusAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('orderStatus')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.orderStatusService
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
          this.orderStatuses = res.data;
        }
      });
  }

  getCustomerAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('customer')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.customerService
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
          this.customers = res.data;
        }
      });
  }

  getAddressAutocomplete() {
    const constant = new Constant();

    this.firstFormGroup
      .get('address')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => {
          this.addresses = [];
          this.isLoading = true;
        }),
        switchMap(value =>
          this.customerService
            .addressList({
              customerId: this.customerId,
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
          this.addresses = res.data;
        }
      });
  }

  getProductAutocomplete() {
    const constant = new Constant();
    this.secondFormGroup
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
    this.firstFormGroup.controls[`${autoId}`].setValue(event.option.value.id);
  }
  onSecondAutoSelectionChanged(autoId, event: MatAutocompleteSelectedEvent) {
    this.secondFormGroup.controls[`${autoId}`].setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  displayAddressFn(data: any): string {
    return data ? data.address : data;
  }

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.firstFormGroup,
      this.formErrors,
      false
    );
    this.formErrors = this.formService.validateForm(
      this.secondFormGroup,
      this.formErrors,
      false
    );
  }

  ngOnInit() {
    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.firstFormGroup = this.formBuilder.group({
      orderTypeId: [this.orderTypeId, Validators.required],
      orderType: [this.orderType, Validators.required],
      customerId: [this.customerId, Validators.required],
      customer: [this.customer, Validators.required],
      addressId: [this.addressId, Validators.required],
      address: [this.address, Validators.required],
      orderStatusId: [this.orderStatusId, Validators.required],
      orderStatus: [this.orderStatus, Validators.required],
      comment: [this.comment, Validators.required],
    });

    this.secondFormGroup = this.formBuilder.group({
      productId: [this.productId, Validators.required],
      product: [this.product, Validators.required],
      quantity: [this.quantity, Validators.required],
    });

    this.getOrderStatusAutocomplete();
    this.getOrderTypeAutocomplete();
    this.getCustomerAutocomplete();
    this.getAddressAutocomplete();
    this.getProductAutocomplete();

    this.setErrors();
  }

  markFormGroupTouched() {
    this.formService.markFormGroupTouched(this.firstFormGroup);
    this.formService.markFormGroupTouched(this.secondFormGroup);
  }

  isFormValid() {
    let status = false;
    if (this.firstFormGroup.valid) {
      status = true;
    }

    return status;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.orderTypeId = response.data.order_type_id;
          this.orderType = {
            id: response.data.order_type_id,
            name: response.data.order_type
          };
          this.customerId = response.data.customer_id;
          this.customer = {
            id: response.data.customer_id,
            name: response.data.name
          };
          this.addressId = response.data.address_id;
          this.address = {
            id: response.data.address_id,
            address: response.data.address
          };
          this.orderStatusId = response.data.order_status_id;
          this.orderStatus = {
            id: response.data.order_status_id,
            name: response.data.order_status
          };
          this.comment = response.data.comment;

          if (response.data.products) {
            response.data.products.forEach(element => {
              this.addCart(element);
            });
          }

        }
      },
      err => {
        console.error(err);
      }
    );

  }

  nextProcess() {
    this.getCarts();
  }

  getCarts() {
    this.orderCartService.list({ customerId: this.customerId }).subscribe(response => {
      this.carts = response.data;
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

  onCartSubmit() {
    // mark all fields as touched
    this.markFormGroupTouched();

    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.spinner.show();
      const data = {
        customerId: this.firstFormGroup.value.customerId,
        productId: this.secondFormGroup.value.productId,
        quantity: this.secondFormGroup.value.quantity,
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

  onSubmit() {
    // mark all fields as touched
    this.markFormGroupTouched();

    if (this.isFormValid()) {
      this.spinner.show();
      const data = {
        orderTypeId: this.firstFormGroup.value.orderTypeId,
        customerId: this.firstFormGroup.value.customerId,
        orderStatusId: this.firstFormGroup.value.orderStatusId,
        addressId: this.firstFormGroup.value.addressId,
        comment: this.firstFormGroup.value.comment,
      };

      this.masterService.save(data, this.getId()).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {

            this.router.navigate(['/orders']);
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
