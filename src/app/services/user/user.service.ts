import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public formData: FormData = new FormData();
  public responseData: any;
  private url;
  errorData: {};
  isLoggedIn = false;
  redirectUrl: string;

  constructor(public http: HttpClient, public configService: ConfigService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.getData()) {
      this.isLoggedIn = true;
    }
  }

  public login(data: any) {
    this.formData = new FormData();
    this.url = `${this.configService.url}user/user_login`;

    this.formData.append('username', data.username);
    this.formData.append('password', data.password);

    return this.http.post<any>(this.url, this.formData).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public setData(data: any) {
    localStorage.setItem('currentUser', JSON.stringify(data));
    this.currentUserSubject.next(data);
    this.isLoggedIn = true;
  }

  public getData() {
    const data = JSON.parse(localStorage.getItem('currentUser'));

    if (data) {
      return data.id;
    } else {
      return null;
    }
  }

  public logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
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

    this.url = `${this.configService.url}user/users`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public detail(id: any) {
    this.formData = new FormData();

    this.url = `${this.configService.url}user/users/detail`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public delete(id: any) {
    this.url = `${this.configService.url}user/users/delete/${id}`;
    return this.http.get<any>(this.url).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public imageUpload(image: File) {
    this.formData = new FormData();
    this.url = `${this.configService.url}user/users/image_upload`;
    this.formData.append('userfile', image);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any, id: any) {
    this.formData = new FormData();
    this.url = `${this.configService.url}user/users/save`;
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
