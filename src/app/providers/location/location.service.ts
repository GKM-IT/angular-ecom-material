import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { isString } from 'util';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

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

    if (data.countryId) {
      this.formData.append('where[country_id]', data.countryId);
    }

    if (data.zoneId) {
      this.formData.append('where[zone_id]', data.zoneId);
    }
    if (data.cityId) {
      this.formData.append('where[city_id]', data.cityId);
    }

    this.url = `${environment.url}location/locations`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public detail(id: any) {
    this.formData = new FormData();

    this.url = `${environment.url}location/locations/detail`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public delete(id: any) {
    this.url = `${environment.url}location/locations/delete/${id}`;
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
    this.url = `${environment.url}location/locations/delete_all`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any, id: any) {
    this.formData = new FormData();
    this.url = `${environment.url}location/locations/save`;
    if (id !== 'new') {
      this.formData.append('id', id);
    }
    this.formData.append('name', data.name);
    this.formData.append('contact_person', data.contactPerson);
    this.formData.append('contact', data.contact);
    this.formData.append('email', data.email);
    this.formData.append('country_id', data.countryId);
    this.formData.append('zone_id', data.zoneId);
    this.formData.append('city_id', data.cityId);
    this.formData.append('postcode', data.postcode);
    this.formData.append('address', data.address);

    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }
}
