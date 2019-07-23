import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingService } from 'src/app/providers/catalog/setting.service';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryService } from 'src/app/providers/location/country.service';
import { ZoneService } from 'src/app/providers/location/zone.service';
import { CityService } from 'src/app/providers/location/city.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { WeightService } from 'src/app/providers/unit/weight.service';
import { LengthService } from 'src/app/providers/unit/length.service';
import { CustomerGroupService } from 'src/app/providers/customer/customer-group.service';
import { EmployeeGroupService } from 'src/app/providers/employee/employee-group.service';
import { UserGroupService } from 'src/app/providers/user/user-group.service';
import { OrderTypeService } from 'src/app/providers/order/order-type.service';
import { PurchaseTypeService } from 'src/app/providers/purchase/purchase-type.service';
import { OrderStatusService } from 'src/app/providers/order/order-status.service';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.css']
})
export class SettingFormComponent implements OnInit {

  public pageHeading = 'Setting Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;

  defaultName: any;
  defaultEmail: any;
  defaultCountry: any;
  defaultZone: any;
  defaultCity: any;
  defaultAddress: any;
  defaultDateFormat: any;
  defaultDateTimeFormat: any;
  defaultDecimalPlace: any;
  defaultOrderType: any;
  pendingOrderStatus: any;
  completeOrderStatus: any;
  defaultPurchaseType: any;
  defaultLengthClass: any;
  defaultWeightClass: any;
  defaultCustomerGroup: any;
  defaultEmployeeGroup: any;
  defaultUserGroup: any;
  defaultLocation: any;


  countries: any = [];
  zones: any = [];
  cities: any = [];
  locations: any = [];
  weightClasses: any = [];
  lengthClasses: any = [];
  customerGroups: any = [];
  employeeGroups: any = [];
  userGroups: any = [];
  orderTypes: any = [];
  orderStatuses: any = [];
  purchaseTypes: any = [];

  public form: FormGroup;
  public formErrors = {
    defaultName: '',
    defaultEmail: '',
    defaultCountry: '',
    defaultZone: '',
    defaultCity: '',
    defaultAddress: '',
    defaultDateFormat: '',
    defaultDateTimeFormat: '',
    defaultDecimalPlace: '',
    defaultOrderType: '',
    pendingOrderStatus: '',
    completeOrderStatus: '',
    defaultPurchaseType: '',
    defaultLengthClass: '',
    defaultWeightClass: '',
    defaultCustomerGroup: '',
    defaultEmployeeGroup: '',
    defaultUserGroup: '',
    defaultLocation: '',
  };

  isLoading = false;

  constructor(
    public masterService: SettingService,
    public countryService: CountryService,
    public zoneService: ZoneService,
    public cityService: CityService,
    public locationService: LocationService,
    public weightService: WeightService,
    public lengthService: LengthService,
    public customerGroupService: CustomerGroupService,
    public employeeGroupService: EmployeeGroupService,
    public userGroupService: UserGroupService,
    public orderTypeService: OrderTypeService,
    public orderStatusService: OrderStatusService,
    public purchaseTypeService: PurchaseTypeService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getDetail();
    this.form = this.formBuilder.group({
      defaultName: [this.defaultName, Validators.required],
      defaultEmail: [this.defaultEmail, Validators.required],
      defaultCountry: [this.defaultCountry, Validators.required],
      defaultZone: [this.defaultZone, Validators.required],
      defaultCity: [this.defaultCity, Validators.required],
      defaultAddress: [this.defaultAddress, Validators.required],
      defaultDateFormat: [this.defaultDateFormat, Validators.required],
      defaultDateTimeFormat: [this.defaultDateTimeFormat, Validators.required],
      defaultDecimalPlace: [this.defaultDecimalPlace, Validators.required],
      defaultOrderType: [this.defaultOrderType, Validators.required],
      pendingOrderStatus: [this.pendingOrderStatus, Validators.required],
      completeOrderStatus: [this.completeOrderStatus, Validators.required],
      defaultPurchaseType: [this.defaultPurchaseType, Validators.required],
      defaultLengthClass: [this.defaultLengthClass, Validators.required],
      defaultWeightClass: [this.defaultWeightClass, Validators.required],
      defaultCustomerGroup: [this.defaultCustomerGroup, Validators.required],
      defaultEmployeeGroup: [this.defaultEmployeeGroup, Validators.required],
      defaultUserGroup: [this.defaultUserGroup, Validators.required],
      defaultLocation: [this.defaultLocation, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });
  }

  getDetail() {
    this.masterService.getSettings().subscribe(
      response => {
        if (response.status) {
          this.defaultName = response.data.defaultName;
          this.defaultEmail = response.data.defaultEmail;
          this.defaultCountry = response.data.defaultCountry;
          this.defaultZone = response.data.defaultZone;
          this.defaultCity = response.data.defaultCity;
          this.defaultAddress = response.data.defaultAddress;
          this.defaultDateFormat = response.data.defaultDateFormat;
          this.defaultDateTimeFormat = response.data.defaultDateTimeFormat;
          this.defaultDecimalPlace = response.data.defaultDecimalPlace;
          this.defaultOrderType = response.data.defaultOrderType;
          this.defaultPurchaseType = response.data.defaultPurchaseType;
          this.defaultLengthClass = response.data.defaultLengthClass;
          this.defaultWeightClass = response.data.defaultWeightClass;
          this.defaultCustomerGroup = response.data.defaultCustomerGroup;
          this.defaultEmployeeGroup = response.data.defaultEmployeeGroup;
          this.defaultUserGroup = response.data.defaultUserGroup;
          this.defaultLocation = response.data.defaultLocation;
          this.pendingOrderStatus = response.data.pendingOrderStatus;
          this.completeOrderStatus = response.data.completeOrderStatus;

          this.getCountries();
          this.getZones();
          this.getCities();
          this.getLocations();

          this.getLengthClasses();
          this.getWeightClasses();
          this.getCustomerGroups();
          this.getUserGroups();
          this.getEmployeeGroups();
          this.getOrderTypes();
          this.getPurchaseTypes();
          this.getOrderStatuses();
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

  getCountries() {
    this.countries = [];
    this.countryService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.countries.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  changeCountry(ev) {
    if (ev) {
      this.defaultCountry = ev;
      this.getZones();
    }
  }

  getZones() {
    this.zones = [];
    this.zoneService.list({ countryId: this.defaultCountry }).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.zones.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  changeZone(ev) {
    if (ev) {
      this.defaultZone = ev;
      this.getCities();
    }
  }

  getCities() {
    this.cities = [];
    this.cityService.list({ countryId: this.defaultCountry, zoneId: this.defaultZone }).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.cities.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  changeCity(ev) {
    if (ev) {
      this.defaultCity = ev;
      this.getLocations();
    }
  }

  getLocations() {
    this.locations = [];
    this.locationService.list({
      countryId: this.defaultCountry,
      zoneId: this.defaultZone,
      cityId: this.defaultCity
    }).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.locations.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getWeightClasses() {
    this.weightClasses = [];
    this.weightService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.weightClasses.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getLengthClasses() {
    this.lengthClasses = [];
    this.lengthService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.lengthClasses.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
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

  getEmployeeGroups() {
    this.employeeGroups = [];
    this.employeeGroupService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.employeeGroups.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getUserGroups() {
    this.userGroups = [];
    this.userGroupService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.userGroups.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getOrderTypes() {
    this.orderTypes = [];
    this.orderTypeService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.orderTypes.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }
  getOrderStatuses() {
    this.orderStatuses = [];
    this.orderStatusService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.orderStatuses.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getPurchaseTypes() {
    this.purchaseTypes = [];
    this.purchaseTypeService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.purchaseTypes.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  public onSubmit() {
    // mark all fields as touched
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {

      this.spinner.show();
      this.masterService.save(this.form.value).subscribe(
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
