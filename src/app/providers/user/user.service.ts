import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public formData: FormData = new FormData();
  private url;

  constructor(public http: HttpClient, public configService: ConfigService) {

  }

  public list(data: any) {
    this.formData = new FormData();

    if (data.draw) {
      this.formData.append('draw', data.draw);
    }

    if (data.length) {
      this.formData.append('length', data.length);
    }

    if (data.start) {
      this.formData.append('start', data.start);
    }

    if (data.search) {
      this.formData.append('search', data.search.value);
    }

    if (data.order) {
      this.formData.append('order[0][column]', data.order[0].column);
      this.formData.append('order[0][dir]', data.order[0].dir);
    }

    this.url = `${environment.url}user/users`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public detail(id: any) {
    this.formData = new FormData();

    this.url = `${environment.url}user/users/detail`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public delete(id: any) {
    this.url = `${environment.url}user/users/delete/${id}`;
    return this.http.get<any>(this.url).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public imageUpload(image: File) {
    this.formData = new FormData();
    this.url = `${environment.url}user/users/image_upload`;
    this.formData.append('userfile', image);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any, id: any) {
    this.formData = new FormData();
    this.url = `${environment.url}user/users/save`;
    if (id) {
      this.formData.append('id', id);
    }
    this.formData.append('type_id', data.type_id);
    this.formData.append('name', data.name);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }
}
