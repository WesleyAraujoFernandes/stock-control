import { ProductHttpService } from './product-http.service';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private readonly httpService = inject(ProductHttpService);

  create(request: CreateProductRequest): Observable<Product> {
    return this.httpService.create(request);
  }

  getProducts(): Observable<Product[]> {
    return this.httpService.getProducts();
  }
  update(id: string, request: UpdateProductRequest): Observable<Product> {
    return this.httpService.update(id, request);
  }

  remove(id: string): Observable<void> {
    return this.httpService.remove(id);
  }

  toggleActive(id: string): Observable<Product | undefined> {
    return this.httpService.toggleActive(id);
  }
}
