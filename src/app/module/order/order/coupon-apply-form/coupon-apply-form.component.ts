import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CouponService } from 'src/app/providers/offer/coupon.service';
import { FormService } from 'src/app/providers/form/form.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-coupon-apply-form',
  templateUrl: './coupon-apply-form.component.html',
  styleUrls: ['./coupon-apply-form.component.css']
})
export class CouponApplyFormComponent implements OnInit {

  public pageHeading = 'Apply Coupon';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  code;

  @Input()
  customerId;

  public form: FormGroup;
  public formErrors = {
    code: '',
    customerId: '',
  };

  constructor(
    public masterService: CouponService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit() {

    this.form = this.formBuilder.group({
      code: [this.code, Validators.required],
      customerId: [this.customerId, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });
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
      this.masterService.apply(this.form.value).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
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
