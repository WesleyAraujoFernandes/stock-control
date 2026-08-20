import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CreateProductRequest } from '../models/create-product.request';
import {
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { UpdateProductRequest } from '../models/update-product.request';
import { ApiError } from '../../../core/errors/api-error';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly totalProducts = computed(() => this.products().length);
  readonly hasProducts = computed(() => this.totalProducts() > 0);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly togglingProductId = signal<string | null>(null);
  readonly toggleError = signal<string | null>(null);
  readonly deletingProductId = signal<string | null>(null);
  readonly deleteError = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService
      .getProducts()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
        },
      });
  }

  create(request: CreateProductRequest): Observable<Product> {
    this.saving.set(true);
    this.saveError.set(null);
    return this.productService.create(request).pipe(
      tap((newProduct) => {
        this.products.update((products) => [
          ...products,
          newProduct,
        ]);
      }),
      catchError((error: ApiError) => {
        this.saveError.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.saving.set(false);
      })
    );
  }

  getById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  update(id: string, request: UpdateProductRequest): Observable<Product> {
    this.saving.set(true);
    this.saveError.set(null);

    return this.productService.update(id, request).pipe(
      tap((updatedProduct) => {
        if (!updatedProduct) {
          return;
        }
        this.products.update((products) =>
          products.map((product) => (product.id === id ? updatedProduct : product))
        );
      }),
      catchError((error: ApiError) => {
        this.saveError.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.saving.set(false);
      })
    );
  }

  remove(id: string): Observable<void> {
    this.deletingProductId.set(id);
    this.deleteError.set(null);
    return this.productService.remove(id).pipe(
      tap(() => {
        this.products.update((products) => products.filter((product) => product.id !== id));
      }),
      catchError((error: ApiError) => {
        this.deleteError.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.deletingProductId.set(null);
      })
    )
  }

  toggleActive(id: string): Observable<Product | undefined> {
    this.togglingProductId.set(id);
    this.toggleError.set(null);
    return this.productService.toggleActive(id).pipe(
      tap((updatedProduct) => {
        if (!updatedProduct) {
          return;
        }

        this.products.update((products) =>
          products.map((product) => (product.id === id ? updatedProduct : product))
        );
      }),
      catchError((error: ApiError) => {
        this.toggleError.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.togglingProductId.set(null);
      })
    );
  }
}
