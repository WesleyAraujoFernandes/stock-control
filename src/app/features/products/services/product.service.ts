import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private readonly storageKey = 'stock-control-products';

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
    const storedProducts = localStorage.getItem(this.storageKey);
    if (!storedProducts) {
      const products = this.getDefaultProducts();
      this.saveProducts(products);
      return products;
    }
    const products = JSON.parse(storedProducts);
    return products.map((product: Product) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }));
  }

  saveProducts(products: Product[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
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
