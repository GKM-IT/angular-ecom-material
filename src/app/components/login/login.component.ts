import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form/form.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    public masterService: UserService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
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
      this.masterService.login(this.form.value).subscribe(
        response => {
          if (!response.status) {
            this.message = response.message;
            this.messageTitle = 'Warning!';
            if (response.result) {
              response.result.forEach(element => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {
            this.message = response.message;
            this.messageTitle = 'Sucess!';
            this.form.reset();
            this.masterService.setData(response.data);
            this.router.navigate(['/']);
            // window.location.replace('/');
          }
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
