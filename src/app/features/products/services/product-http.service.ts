import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';

@Injectable({
  providedIn: 'root',
})
export class ProductHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, request);
  }

  update(id: string, request: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, request);
  }

  toggleActive(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/active`, null);
  }
}
