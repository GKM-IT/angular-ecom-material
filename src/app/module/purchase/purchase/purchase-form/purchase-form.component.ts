import { Component, OnInit } from '@angular/core';
import { PurchaseTypeService } from 'src/app/providers/purchase/purchase-type.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseService } from 'src/app/providers/purchase/purchase.service';
import { PurchaseStatusService } from 'src/app/providers/purchase/purchase-status.service';
import { VendorService } from 'src/app/providers/vendor/vendor.service';
import { PurchaseCartService } from 'src/app/providers/purchase/purchase-cart.service';
import { ProductService } from 'src/app/providers/product/product.service';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { PurchaseCartListComponent } from '../purchase-cart-list/purchase-cart-list.component';

@Component({
  providers: [PurchaseCartListComponent],
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {

  public pageHeading = 'Purchase Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;

  isLoading = false;

  purchaseTypes: any = [];
  purchaseStatuses: any = [];
  vendors: any = [];
  products: any = [];
  carts: any = [];
  cartDisplayedColumns: string[] = ['product', 'product_image', 'quantity', 'price', 'tax', 'total', 'action'];

  purchaseTypeId;
  purchaseType: { id: any; name: any; };
  vendorId;
  vendor: { id: any; name: any; };
  purchaseStatusId;
  purchaseStatus: { id: any; name: any; };
  comment;


  public formErrors = {
    vendorId: '',
    vendor: '',
    purchaseTypeId: '',
    purchaseType: '',
    purchaseStatusId: '',
    purchaseStatus: '',
    comment: '',
  };

  firstFormGroup: FormGroup;


  constructor(
    public masterService: PurchaseService,
    public purchaseTypeService: PurchaseTypeService,
    public purchaseStatusService: PurchaseStatusService,
    public vendorService: VendorService,
    public purchaseCartService: PurchaseCartService,
    public productService: ProductService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private purchaseCartListComponent: PurchaseCartListComponent
  ) { }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/purchases']);
  }

  getpurchaseTypeAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('purchaseType')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.purchaseTypeService
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
          this.purchaseTypes = res.data;
        }
      });
  }

  getpurchaseStatusAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('purchaseStatus')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.purchaseStatusService
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
          this.purchaseStatuses = res.data;
        }
      });
  }

  getVendorAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('vendor')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.vendorService
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
          this.vendors = res.data;
        }
      });
  }


  onAutoSelectionChanged(autoId, event: MatAutocompleteSelectedEvent) {
    this.firstFormGroup.controls[`${autoId}`].setValue(event.option.value.id);
  }


  displayFn(data: any): string {
    return data ? data.name : data;
  }



  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.firstFormGroup,
      this.formErrors,
      false
    );

  }

  ngOnInit() {
    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.firstFormGroup = this.formBuilder.group({
      purchaseTypeId: [this.purchaseTypeId, Validators.required],
      purchaseType: [this.purchaseType, Validators.required],
      vendorId: [this.vendorId, Validators.required],
      vendor: [this.vendor, Validators.required],
      purchaseStatusId: [this.purchaseStatusId, Validators.required],
      purchaseStatus: [this.purchaseStatus, Validators.required],
      comment: [this.comment, Validators.required],
    });


    this.getpurchaseStatusAutocomplete();
    this.getpurchaseTypeAutocomplete();
    this.getVendorAutocomplete();


    this.setErrors();
  }

  markFormGroupTouched() {
    this.formService.markFormGroupTouched(this.firstFormGroup);
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
          this.purchaseTypeId = response.data.purchase_type_id;
          this.purchaseType = {
            id: response.data.purchase_type_id,
            name: response.data.purchase_type
          };
          this.vendorId = response.data.vendor_id;
          this.vendor = {
            id: response.data.vendor_id,
            name: response.data.name
          };
          this.purchaseStatusId = response.data.purchase_status_id;
          this.purchaseStatus = {
            id: response.data.purchase_status_id,
            name: response.data.purchase_status
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
    this.purchaseCartListComponent.ngOnInit();
  }

  addCart(cartData) {
    const data = {
      vendorId: this.vendorId,
      productId: cartData.product_id,
      quantity: cartData.quantity,
      price: cartData.price,
      tax: cartData.tax,
    };

    this.purchaseCartService.save(data, 'new').subscribe(
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

  onSubmit() {
    // mark all fields as touched
    this.markFormGroupTouched();

    if (this.isFormValid()) {
      this.spinner.show();
      const data = {
        purchaseTypeId: this.firstFormGroup.value.purchaseTypeId,
        vendorId: this.firstFormGroup.value.vendorId,
        purchaseStatusId: this.firstFormGroup.value.purchaseStatusId,
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

            this.router.navigate(['/purchases']);
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
