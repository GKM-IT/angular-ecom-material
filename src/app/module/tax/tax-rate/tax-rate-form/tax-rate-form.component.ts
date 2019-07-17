import { Component, OnInit } from '@angular/core';
import { TaxRateService } from 'src/app/providers/tax/tax-rate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TaxClassService } from 'src/app/providers/tax/tax-class.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tax-rate-form',
  templateUrl: './tax-rate-form.component.html',
  styleUrls: ['./tax-rate-form.component.css']
})
export class TaxRateFormComponent implements OnInit {
  public pageHeading = 'Tax Rate Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  taxClassId;
  taxClass;
  taxClasses;
  name;
  rate;
  type;
  isLoading = false;


  public form: FormGroup;
  public formErrors = {
    taxClass: '',
    name: '',
    rate: '',
    type: '',
  };

  constructor(
    public masterService: TaxRateService,
    public taxClassService: TaxClassService,
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
    this.router.navigate(['/tax-rates']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      taxClass: [this.taxClass, Validators.required],
      taxClassId: [this.taxClassId, Validators.required],
      name: [this.name, Validators.required],
      rate: [this.rate, Validators.required],
      type: [this.type, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });

    this.getAutocomplete();
  }

  getAutocomplete() {
    const constant = new Constant();
    this.form
      .get('taxClass')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.taxClassService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.taxClasses = res.data;
        }
      });
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.typeId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.taxClass = {
            id: response.data.tax_class_id,
            name: response.data.tax_class
          };
          this.taxClassId = response.data.tax_class_id;
          this.name = response.data.name;
          this.rate = response.data.rate;
          this.type = response.data.type;
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
            this.router.navigate(['/tax-rates']);
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
