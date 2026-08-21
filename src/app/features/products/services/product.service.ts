import { ProductRepository } from '../repositories/product-repository';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private readonly productRepository = inject(ProductRepository);

  getProducts(): Observable<Product[]> {
    return this.productRepository.getProducts();
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.productRepository.create(request);
  }

  update(id: string, request: UpdateProductRequest): Observable<Product> {
    return this.productRepository.update(id, request);
  }

  remove(id: string): Observable<void> {
    return this.productRepository.remove(id);
  }

  toggleActive(id: string): Observable<Product | undefined> {
    return this.productRepository.toggleActive(id);
  }
}
