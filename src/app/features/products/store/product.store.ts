import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CreateProductRequest } from '../models/create-product.request';
import { Observable, tap } from 'rxjs';

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
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.productService.create(request).pipe(tap((newProduct) => {
      this.products.update((products) => [...products, newProduct]);
    }))
  }

  getById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  update(id: string, request: CreateProductRequest): Observable<Product | undefined> {
    return this.productService.update(id, request).pipe(tap((updatedProduct) => {
      if (!updatedProduct) {
        return;
      }
      this.products.update((product) => product.map((product) => product.id === id ? updatedProduct : product));
    }))
  }

  remove(id: string): Observable<boolean> {
    return this.productService.remove(id).pipe(
      tap((removed) => {
        if (!removed) {
          return;
        }
        this.products.update((products) => products.filter((product) => product.id !== id));
      })
    );
  }

  toggleActive(id: string): boolean {
    const existingProduct = this.getById(id);

    if (!existingProduct) {
      return false;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      active: !existingProduct.active,
      updatedAt: new Date(),
    };

    // Nota: Se a alteração de status precisar persistir no back-end/localStorage,
    // o ideal seria criar um método no service e assinar aqui de forma similar ao update.
    this.products.update((products) =>
      products.map((product) => (product.id === id ? updatedProduct : product))
    );
    return true;
  }
}
