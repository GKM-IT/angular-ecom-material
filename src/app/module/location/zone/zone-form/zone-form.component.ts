import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from 'src/app/providers/form/form.service';
import { ZoneService } from 'src/app/providers/location/zone.service';
import { CountryService } from 'src/app/providers/location/country.service';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrls: ['./zone-form.component.css']
})
export class ZoneFormComponent implements OnInit {

  filteredStates: Observable<any[]>;
  public pageHeading = 'Zone Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  country;
  countryId;
  name;
  code;
  countries;
  isLoading = false;

  public form: FormGroup;
  public formErrors = {
    country: '',
    name: '',
    code: '',
  };

  constructor(
    public masterService: ZoneService,
    public countryService: CountryService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {

  }



  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/zones']);
  }

  ngOnInit() {
    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      country: [this.country, Validators.required],
      name: [this.name, Validators.required],
      code: [this.code, [Validators.required]],
    });

    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        true
      );
    });

    this.countryAutocomplete();
  }


  countryAutocomplete() {
    this.form
      .get('country')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(600),
        tap(() => this.isLoading = true),
        switchMap(value => this.countryService.list({ search: value, pageSize: 5, pageIndex: 0, sort_by: 'name' })
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(res => {
        this.countries = res.data;
      });
  }

  displayFn(country: any): string {
    return country ? country.name : country;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.country = {
            id: response.data.country_id,
            name: response.data.country,
          };
          this.name = response.data.name;
          this.code = response.data.code;
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
            this.router.navigate(['/zones']);
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
