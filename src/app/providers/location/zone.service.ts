import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/providers/config/config.service';
import { isString } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private url;
  private formData: FormData = new FormData();

  constructor(
    public http: HttpClient,
    private configService: ConfigService
  ) {
  }

  public list(data: any) {
    this.formData = new FormData();

    if (data.search && isString(data.search)) {
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

    this.url = `${environment.url}location/zones`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public detail(id: any) {
    this.formData = new FormData();

    this.url = `${environment.url}location/zones/detail`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public delete(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Headers', '*');

    this.url = `${environment.url}location/zones/${id}`;
    const options = {
      headers,
      body: {}
    }
    return this.http.delete<any>(this.url, options).pipe(
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
    this.url = `${environment.url}location/zones/delete_all`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any, id: any) {
    this.formData = new FormData();
    this.url = `${environment.url}location/zones/save`;
    if (id && id !== 'new') {
      this.formData.append('id', id);
    }
    this.formData.append('country_id', data.countryId);
    this.formData.append('name', data.name);
    this.formData.append('code', data.code);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

}
