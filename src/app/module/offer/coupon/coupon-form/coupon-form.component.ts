import { Component, OnInit } from '@angular/core';
import { CouponService } from 'src/app/providers/offer/coupon.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerGroupService } from 'src/app/providers/customer/customer-group.service';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnInit {
  public pageHeading = 'Coupon Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  code;
  customerGroupId;
  start;
  end;
  name;
  discountType;
  discount;
  usedLimit;

  customerGroups: any = [];
  discountTypes: any = [];

  public form: FormGroup;
  public formErrors = {
    code: '',
    customerGroupId: '',
    start: '',
    end: '',
    name: '',
    discountType: '',
    discount: '',
    usedLimit: '',
  };

  constructor(
    public masterService: CouponService,
    public customerGroupService: CustomerGroupService,
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
    this.router.navigate(['/coupons']);
  }

  getCustomerGroups() {
    this.customerGroups = [];
    this.customerGroupService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.customerGroups.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  ngOnInit() {
    this.discountTypes.push(
      {
        text: 'Fixed',
        value: 'F'
      },
      {
        text: 'Percentage',
        value: 'P'
      }
    );
    this.getCustomerGroups();
    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      code: [this.code, Validators.required],
      name: [this.name, Validators.required],
      customerGroupId: [this.customerGroupId, Validators.required],
      start: [new Date(this.start), Validators.required],
      end: [new Date(this.end), Validators.required],
      discountType: [this.discountType, Validators.required],
      discount: [this.discount, Validators.required],
      usedLimit: [this.usedLimit, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.code = response.data.code;
          this.name = response.data.name;
          this.customerGroupId = response.data.customerGroupId;
          this.start = new Date(response.data.start);
          this.end = new Date(response.data.end);
          this.discountType = response.data.discountType;
          this.discount = response.data.discount;
          this.usedLimit = response.data.usedLimit;
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
            this.router.navigate(['/coupons']);
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
