import { ProductHttpService } from './product-http.service';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { ProductRepository } from '../repositories/product.repository';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private readonly repository = inject(ProductRepository);
  private readonly httpService = inject(ProductHttpService);

  create(request: CreateProductRequest): Observable<Product> {
    return this.httpService.create(request);
  }

  getProducts(): Observable<Product[]> {
    return this.httpService.getProducts();
  }
  update(id: string, request: UpdateProductRequest): Observable<Product | undefined> {
    return this.httpService.update(id, request);
  }

  remove(id: string): Observable<boolean> {
    return this.repository.remove(id);
  }

  toggleActive(id: string): Observable<Product | undefined> {
    return this.httpService.toggleActive(id);
  }
}
