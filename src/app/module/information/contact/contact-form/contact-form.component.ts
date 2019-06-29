import { Component, OnInit } from '@angular/core';
import { InquiryService } from 'src/app/providers/inquiry/inquiry.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InquiryTypeService } from 'src/app/providers/inquiry/inquiry-type.service';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  public pageHeading = 'contact Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  name;
  email;
  contact;
  typeId;
  type;
  types;
  text;
  isLoading = false;


  public form: FormGroup;
  public formErrors = {
    type: '',
    name: '',
    email: '',
    contact: '',
    text: '',
  };

  constructor(
    public masterService: InquiryService,
    public inquiryTypeService: InquiryTypeService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/contacts']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      type: [this.type, Validators.required],
      typeId: [this.typeId],
      name: [this.name, Validators.required],
      email: [this.email, Validators.required],
      contact: [this.contact, Validators.required],
      text: [this.text, Validators.required],
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
      .get('type')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.inquiryTypeService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.types = res.data;
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
          this.name = response.data.name;
          this.email = response.data.email;
          this.contact = response.data.contact;
          this.text = response.data.text;
          this.type = {
            id: response.data.type_id,
            name: response.data.type,
          };
          this.typeId = response.data.type_id;
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
            this.router.navigate(['/contacts']);
          }

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
