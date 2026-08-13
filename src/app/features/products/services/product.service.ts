import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { ProductRepository } from '../repositories/product.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() { }

  private readonly repository = inject(ProductRepository);

  create(request: CreateProductRequest): Product {
    return this.repository.create(request);
  }

  getProducts(): Product[] {
    return this.repository.getProducts();
  }
  update(
    id: string,
    request: CreateProductRequest
  ): Product | undefined {
    return this.repository.update(id, request);
  }

  remove(id: string): boolean {
    return this.repository.remove(id);
  }
}
