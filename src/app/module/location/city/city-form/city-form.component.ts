import { Component, OnInit } from '@angular/core';
import { CityService } from 'src/app/providers/location/city.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountryService } from 'src/app/providers/location/country.service';
import { ZoneService } from 'src/app/providers/location/zone.service';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent implements OnInit {

  public pageHeading = 'City Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  name;
  code;
  countries;
  country;
  countryId;
  zones;
  zone;
  zoneId;

  isLoading = false;

  public form: FormGroup;
  public formErrors = {
    name: '',
    code: '',
    country: '',
    zone: '',
  };

  constructor(
    public masterService: CityService,
    public countryService: CountryService,
    public zoneService: ZoneService,
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
    this.router.navigate(['/cities']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      code: [this.code, Validators.required],
      country: [this.country, Validators.required],
      countryId: [this.countryId, Validators.required],
      zone: [this.zone, Validators.required],
      zoneId: [this.zoneId, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        true
      );
    });
    this.getCountryAutocomplete();
    this.getZoneAutocomplete();
  }

  getCountryAutocomplete() {
    const constant = new Constant();
    this.form
      .get('country')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.countryService.list({ search: value, pageSize: constant.autocompleteListSize, pageIndex: 0, sort_by: 'name' }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.countries = res.data;
        }
      });
  }

  onCountrySelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.countryId.setValue(event.option.value.id);
  }
  getZoneAutocomplete() {
    const constant = new Constant();
    this.form
      .get('zone')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.zoneService.list(
            {
              search: value,
              countryId: this.countryId,
              pageSize: constant.autocompleteListSize,
              pageIndex: 0,
              sort_by: 'name'
            }
          )
            .pipe(
              finalize(() => this.isLoading = false),
            )
        )
      ).subscribe(res => {
        if (res.status) {
          this.zones = res.data;
        }
      });
  }

  onZoneSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.zoneId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.name = response.data.name;
          this.code = response.data.code;
          this.country = {
            id: response.data.country_id,
            name: response.data.country,
          };
          this.countryId = response.data.country_id;
          this.zone = {
            id: response.data.zone_id,
            name: response.data.zone,
          };
          this.zoneId = response.data.zone_id;
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
            this.router.navigate(['/cities']);
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
