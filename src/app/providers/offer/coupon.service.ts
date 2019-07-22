import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Dateformat } from 'src/app/helper/dateformat';

@Injectable({
  providedIn: 'root'
})
export class CouponService {


  public formData: FormData = new FormData();
  private url;

  constructor(public http: HttpClient, public configService: ConfigService) {

  }

  public list(data: any) {
    this.formData = new FormData();

    if (data.search && typeof data.search === 'string') {
      this.formData.append('search', data.search);
    }
    if (data.pageSize) {
      this.formData.append('length', data.pageSize);
    }
    if (data.pageIndex) {
      this.formData.append('start', data.pageIndex);
    }
    if (data.sort_by) {
      this.formData.append('sort_by', data.sort_by);
    }
    if (data.sort_dir) {
      this.formData.append('sort_dir', data.sort_dir);
    }

    this.url = `${environment.url}offer/coupons`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public detail(id: any) {
    this.formData = new FormData();

    this.url = `${environment.url}offer/coupons/detail`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public delete(id: any) {
    this.url = `${environment.url}offer/coupons/delete/${id}`;
    return this.http.get<any>(this.url).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public deleteAll(data: any) {
    const selected = data.map(row => (
      row.id
    ));
    this.formData = new FormData();
    this.formData.append('list', JSON.stringify(selected));
    this.url = `${environment.url}offer/coupons/delete_all`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any, id: any) {
    const dateformat = new Dateformat();
    this.formData = new FormData();
    this.url = `${environment.url}offer/coupons/save`;
    if (id !== 'new') {
      this.formData.append('id', id);
    }
    this.formData.append('code', data.code);
    this.formData.append('customer_group_id', data.customerGroupId);
    this.formData.append('start_date', dateformat.dateConvert(data.start));
    this.formData.append('end_date', dateformat.dateConvert(data.end));
    this.formData.append('name', data.name);
    this.formData.append('discount_type', data.discountType);
    this.formData.append('discount', data.discount);
    this.formData.append('used_limit', data.usedLimit);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public apply(data: any) {
    this.formData = new FormData();
    this.url = `${environment.url}offer/coupons/apply`;
    this.formData.append('code', data.code);
    this.formData.append('customer_id', data.customerId);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }
}
