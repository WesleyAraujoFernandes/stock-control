import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { StorageService } from './storage.service';
import { PRODUCT_STORAGE_KEY } from '../constants/product-storage.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private readonly storage = inject(StorageService);

  create(request: CreateProductRequest): Product {
    return {
      id: crypto.randomUUID(),
      ...request,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  getProducts(): Product[] {
    const storedProducts = this.storage.get<Product[]>(PRODUCT_STORAGE_KEY);
    if (!storedProducts) {
      const products = this.getDefaultProducts();
      this.saveProducts(products);
      return products;
    }
    return storedProducts.map((product) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }));
  }

  saveProducts(products: Product[]) {
    this.storage.set(PRODUCT_STORAGE_KEY, products);
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Notebook',
        sku: 'NB001',
        category: 'Informática',
        quantity: 12,
        minimumStock: 5,
        unitPrice: 4200,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Mouse',
        sku: 'MS001',
        category: 'Informática',
        quantity: 50,
        minimumStock: 10,
        unitPrice: 89,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
