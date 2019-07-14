import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../config/config.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    this.url = `${environment.url}user/user_login`;

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
  public getToken() {
    const data = JSON.parse(localStorage.getItem('currentUser'));

    if (data) {
      return data.token;
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
