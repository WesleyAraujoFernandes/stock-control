import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CreateProductRequest } from '../models/create-product.request';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);
  readonly products = signal<Product[]>([]);
  readonly totalProducts = computed(() => this.products().length);
  readonly hasProducts = computed(() => this.totalProducts() > 0);

  constructor() {
    this.load();
  }

  load(): void {
    this.products.set(this.productService.getProducts());
  }

  create(request: CreateProductRequest): Product {
    const product = this.productService.create(request);
    this.products.update((products) => [...products, product]);
    return product;
  }

  getById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  update(id: string, request: CreateProductRequest): Product | undefined {
    const existingProduct = this.getById(id);

    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...request,
      id: existingProduct.id,
      createdAt: existingProduct.createdAt,
      updatedAt: new Date(),
    };

    this.products.update((products) =>
      products.map((product) => (product.id === id ? updatedProduct : product))
    );

    return updatedProduct;
  }

  remove(id: string): boolean {
    this.products.update((products) =>
      products.filter((product) => product.id !== id)
    );
    return true;
  }
}
