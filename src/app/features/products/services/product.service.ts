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

  create(request: CreateProductRequest): Observable<Product> {
    return this.repository.create(request);
  }

  getProducts(): Observable<Product[]> {
    return this.repository.getProducts();
  }
  update(id: string, request: UpdateProductRequest): Observable<Product | undefined> {
    return this.repository.update(id, request);
  }

  remove(id: string): Observable<boolean> {
    return this.repository.remove(id);
  }

  toggleActive(id: string): Observable<Product | undefined> {
    const product = this.repository.getById(id);

    if (!product) {
      return of(undefined);
    }

    const newActive = !product.active;

    return this.repository.update(id, {
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      minimumStock: product.minimumStock,
      unitPrice: product.unitPrice,
      active: !product.active,
    });
  }
}
