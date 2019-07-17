import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/providers/user/auth.service';
import { FormService } from 'src/app/providers/form/form.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public pageHeading = 'Login Form';
  public data: any;
  public status;
  public message;
  public messageTitle;
  hide = true;
  public username;
  public password;

  public form: FormGroup;
  public formErrors = {
    username: '',
    password: '',

  };

  constructor(
    public masterService: AuthService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        true
      );
    });
  }


  public onSubmit() {
    // mark all fields as touched
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      this.spinner.show();
      this.masterService.login(this.form.value).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach(element => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {
            this.form.reset();
            this.masterService.setData(response.data);
            this.router.navigate(['/']);
            // window.location.replace('/');
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
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        false
      );
    }
  }

}
