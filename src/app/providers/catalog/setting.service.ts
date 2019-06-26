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

  public save(data: any, id: any) {
    this.formData = new FormData();
    this.url = `${environment.url}common/settings/save`;
    if (id !== 'new') {
      this.formData.append('id', id);
    }
    this.formData.append('name', data.name);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }
}
