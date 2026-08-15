import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CreateProductRequest } from '../models/create-product.request';
import { Observable, ObservableNotification, tap } from 'rxjs';
import { UpdateProductRequest } from '../models/update-product.request';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly totalProducts = computed(() => this.products().length);
  readonly hasProducts = computed(() => this.totalProducts() > 0);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: () => this.error.set('Nao foi possivel carregar os produtos'),
    });
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.productService.create(request).pipe(
      tap((newProduct) => {
        this.products.update((products) => [...products, newProduct]);
      })
    );
  }

  getById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  update(id: string, request: UpdateProductRequest): Observable<Product | undefined> {
    return this.productService.update(id, request).pipe(
      tap((updatedProduct) => {
        if (!updatedProduct) {
          return;
        }
        this.products.update((product) =>
          product.map((product) => (product.id === id ? updatedProduct : product))
        );
      })
    );
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

  toggleActive(id: string): Observable<Product | undefined> {
    return this.productService.toggleActive(id).pipe(
      tap((updatedProduct) => {
        if (!updatedProduct) {
          return;
        }

        this.products.update((products) =>
          products.map((product) => (product.id === id ? updatedProduct : product))
        );
      })
    );
  }
}
