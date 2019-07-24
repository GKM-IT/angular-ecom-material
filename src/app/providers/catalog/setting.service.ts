import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  public formData: FormData = new FormData();
  private url;

  constructor(public http: HttpClient, public configService: ConfigService) {

  }

  public getSettings() {
    this.url = `${environment.url}setting/settings`;
    return this.http.get<any>(this.url).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any) {
    this.formData = new FormData();
    this.url = `${environment.url}setting/settings/save`;
    this.formData.append('default_name', data.defaultName);
    this.formData.append('default_email', data.defaultEmail);
    this.formData.append('default_country', data.defaultCountry);
    this.formData.append('default_zone', data.defaultZone);
    this.formData.append('default_city', data.defaultCity);
    this.formData.append('default_address', data.defaultAddress);
    this.formData.append('default_date_format', data.defaultDateFormat);
    this.formData.append('default_date_time_format', data.defaultDateTimeFormat);
    this.formData.append('default_decimal_place', data.defaultDecimalPlace);
    this.formData.append('default_order_type', data.defaultOrderType);
    this.formData.append('pending_order_status', data.pendingOrderStatus);
    this.formData.append('complete_order_status', data.completeOrderStatus);
    this.formData.append('pending_purchase_status', data.pendingPurchaseStatus);
    this.formData.append('complete_purchase_status', data.completePurchaseStatus);
    this.formData.append('default_purchase_type', data.defaultPurchaseType);
    this.formData.append('default_length_class', data.defaultLengthClass);
    this.formData.append('default_weight_class', data.defaultWeightClass);
    this.formData.append('default_customer_group', data.defaultCustomerGroup);
    this.formData.append('default_employee_group', data.defaultEmployeeGroup);
    this.formData.append('default_user_group', data.defaultUserGroup);
    this.formData.append('default_location', data.defaultLocation);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }
}
