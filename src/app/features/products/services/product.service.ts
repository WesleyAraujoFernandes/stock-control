import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { ProductRepository } from '../repositories/product.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() { }

  private readonly repository = inject(ProductRepository);

  create(request: CreateProductRequest): Observable<Product> {
    return this.repository.create(request);
  }

  getProducts(): Observable<Product[]> {
    return this.repository.getProducts();
  }
  update(
    id: string,
    request: CreateProductRequest
  ): Observable<Product | undefined> {
    return this.repository.update(id, request);
  }

  remove(id: string): Observable<boolean> {
    return this.repository.remove(id);
  }
}
