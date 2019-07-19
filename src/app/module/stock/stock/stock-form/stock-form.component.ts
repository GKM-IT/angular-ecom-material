import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/providers/stock/stock.service';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/providers/product/product.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Constant } from 'src/app/helper/constant';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent implements OnInit {


  public pageHeading = 'Stock Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  productId;
  product: { id: any; name: any; };
  products: any = [];
  locationId;
  location: { id: any; name: any; };
  locations: any = [];
  price;
  quantity;
  type;
  text;


  public form: FormGroup;
  public formErrors = {
    product: '',
    location: '',
    price: '',
    quantity: '',
    type: '',
    text: '',
  };

  isLoading = false;

  constructor(
    public masterService: StockService,
    public productService: ProductService,
    public locationService: LocationService,
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
    this.router.navigate(['/stocks']);
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

  getLocationAutocomplete() {
    const constant = new Constant();
    this.form
      .get('location')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.locationService
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
          this.locations = res.data;
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

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      product: [this.product, Validators.required],
      productId: [this.productId, Validators.required],
      location: [this.location, Validators.required],
      locationId: [this.locationId, Validators.required],
      price: [this.price, Validators.required],
      quantity: [this.quantity, Validators.required],
      text: [this.text, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.price = response.data.price;
          this.quantity = response.data.quantity;
          this.text = response.data.text;
          this.type = response.data.type;

          this.product = {
            id: response.data.product_id,
            name: response.data.product
          };
          this.location = {
            id: response.data.location_id,
            name: response.data.location
          };
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
            this.router.navigate(['/stocks']);
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
