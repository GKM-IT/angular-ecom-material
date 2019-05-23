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
}
