import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/providers/location/location.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CityService } from 'src/app/providers/location/city.service';
import { ZoneService } from 'src/app/providers/location/zone.service';
import { CountryService } from 'src/app/providers/location/country.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit {

  public pageHeading = 'Location Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  name;
  contactPerson;
  email;
  contact;
  postcode;
  address;

  countries;
  country;
  countryId;
  zones;
  zone;
  zoneId;
  cities;
  city;
  cityId;

  isLoading = false;


  public form: FormGroup;
  public formErrors = {
    name: '',
    contactPerson: '',
    email: '',
    contact: '',
    postcode: '',
    address: '',
    country: '',
    zone: '',
    city: '',
  };

  constructor(
    public masterService: LocationService,
    public countryService: CountryService,
    public zoneService: ZoneService,
    public cityService: CityService,
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
    this.router.navigate(['/banners']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      contactPerson: [this.contactPerson, Validators.required],
      contact: [this.contact, Validators.required],
      email: [this.email, Validators.required],
      postcode: [this.postcode, Validators.required],
      address: [this.address, Validators.required],
      country: [this.country, Validators.required],
      countryId: [this.countryId, Validators.required],
      zone: [this.zone, Validators.required],
      zoneId: [this.zoneId, Validators.required],
      city: [this.city, Validators.required],
      cityId: [this.cityId, Validators.required],
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
    this.getCityAutocomplete();
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
  getCityAutocomplete() {
    const constant = new Constant();
    this.form
      .get('city')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.cityService.list(
            {
              search: value,
              countryId: this.countryId,
              zoneId: this.zoneId,
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

  onCitySelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.cityId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.name = response.data.name;
          this.contactPerson = response.data.contact_person;
          this.contact = response.data.contact;
          this.email = response.data.email;
          this.postcode = response.data.postcode;
          this.address = response.data.address;

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
          this.city = {
            id: response.data.city_id,
            name: response.data.city,
          };
          this.cityId = response.data.city_id;
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
            this.router.navigate(['/locations']);
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
