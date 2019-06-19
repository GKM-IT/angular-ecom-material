import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public formData: FormData = new FormData();
  private url;

  constructor(public http: HttpClient) {
  }

  public list(url: string, data: any) {
    this.url = `${environment.url}${url}`;
    return this.http.post<any>(this.url, data).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.handleError)
    );
  }


  public detail(url: string, id: any) {
    this.formData = new FormData();

    this.url = `${environment.url}${url}`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.handleError)
    );
  }

  public delete(url: string, id: any) {
    this.url = `${environment.url}${url}/${id}`;
    return this.http.get<any>(this.url).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.handleError)
    );
  }

  public deleteAll(url: string, data: any) {
    const selected = data.map(row => (
      row.id
    ));
    this.formData = new FormData();
    this.formData.append('list', JSON.stringify(selected));
    this.url = `${environment.url}${url}`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.handleError)
    );
  }

  public save(url: string, data: any) {
    this.formData = new FormData();
    this.url = `${environment.url}${url}`;
    return this.http.post<any>(this.url, data).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.handleError)
    );
  }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

export class ValidationService {

  static emailValidator(control) {
    // RFC 2822 compliant regex
    // tslint:disable-next-line: max-line-length
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { range: true };
      }
      return null;
    };
  }
}



export function routerTransition() {
  return slideToLeft();
}

export function slideToLeft() {
  return trigger('routerTransition', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', position: 'fixed', width: '100%' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0%)', position: 'fixed', width: '100%' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
    ])
  ]);
}
