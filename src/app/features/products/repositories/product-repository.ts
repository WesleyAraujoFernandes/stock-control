import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endpoint);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.endpoint, request);
  }

  update(id: string, request: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.endpoint}/${id}`, request);
  }

  toggleActive(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.endpoint}/${id}/active`, null);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
