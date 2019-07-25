import { Injectable } from '@angular/core';

import { ConfigService } from '../config/config.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { isString } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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

    this.url = `${environment.url}product/products`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public detail(id: any) {
    this.formData = new FormData();

    this.url = `${environment.url}product/products/detail`;
    this.formData.append('id', id);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public delete(id: any) {
    this.url = `${environment.url}product/products/delete/${id}`;
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
    this.url = `${environment.url}product/products/delete_all`;
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public save(data: any, id: any) {
    this.formData = new FormData();
    this.url = `${environment.url}product/products/save`;
    if (id !== 'new') {
      this.formData.append('id', id);
    }
    this.formData.append('image', data.image);
    this.formData.append('type_id', data.typeId);
    this.formData.append('manufacture_id', data.manufactureId);
    this.formData.append('code', data.code);
    this.formData.append('model', data.model);
    this.formData.append('sku', data.sku);
    this.formData.append('name', data.name);
    this.formData.append('price_type', data.priceType);
    this.formData.append('price', data.price);
    this.formData.append('mrp', data.mrp);
    this.formData.append('margin', data.margin);
    this.formData.append('description', data.description);
    this.formData.append('text', data.text);
    this.formData.append('tax_class_id', data.taxClassId);
    this.formData.append('length_class_id', data.lengthClassId);
    this.formData.append('length', data.length);
    this.formData.append('width', data.width);
    this.formData.append('height', data.height);
    this.formData.append('weight_class_id', data.weightClassId);
    this.formData.append('weight', data.weight);
    this.formData.append('minimum', data.minimum);
    this.formData.append('shipping', data.shipping);
    this.formData.append('inventory', data.inventory);
    this.formData.append('stock', data.stock);
    this.formData.append('featured', data.featured);
    this.formData.append('categories', JSON.stringify(data.categories));
    this.formData.append('relatedProducts', JSON.stringify(data.relatedProducts));
    this.formData.append('attributes', JSON.stringify(data.productAttributes));
    this.formData.append('prices', JSON.stringify(data.prices));
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }

  public imageUpload(image: File) {
    this.formData = new FormData();
    this.url = `${environment.url}product/products/image_upload`;
    this.formData.append('userfile', image);
    return this.http.post<any>(this.url, this.formData).pipe(
      // retry(1), // retry a failed request up to 3 times
      catchError(this.configService.handleError)
    );
  }
}
