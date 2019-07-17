import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from 'src/app/providers/vendor/vendor.service';
import { VendorGroupService } from 'src/app/providers/vendor/vendor-group.service';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css']
})
export class VendorFormComponent implements OnInit {

  public pageHeading = 'vendor Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  name;
  email;
  contact;

  group;
  groupId;
  groups;
  isLoading = false;


  public form: FormGroup;
  public formErrors = {
    group: '',
    name: '',
    email: '',
    contact: '',
  };

  constructor(
    public masterService: VendorService,
    public vendorGroupService: VendorGroupService,
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
    this.router.navigate(['/vendors']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      group: [this.group, Validators.required],
      groupId: [this.groupId],
      name: [this.name, Validators.required],
      email: [this.email, Validators.required],
      contact: [this.contact, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        true
      );
    });

    this.getAutocomplete();
  }



  getAutocomplete() {
    const constant = new Constant();
    this.form
      .get('group')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.vendorGroupService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.groups = res.data;
        }
      });
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.groupId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.name = response.data.name;
          this.email = response.data.email;
          this.contact = response.data.contact;
          this.group = {
            id: response.data.group_id,
            name: response.data.group_name,
          };
          this.groupId = response.data.group_id;
        }
      },
      err => {
        console.error(err);
      }
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
            this.router.navigate(['/vendors']);
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
